/** Rak.Hi Arts + Orchha with Rakhi. Google Sheets is the only business datastore. */
const APP = Object.freeze({
  VERSION: '1.1.0-api',
  DB_PROPERTY: 'RAKHI_SPREADSHEET_ID',
  SECRET_PROPERTY: 'RAKHI_PASSWORD_PEPPER',
  SESSION_HOURS_PROPERTY: 'RAKHI_SESSION_HOURS',
  DEFAULT_SESSION_HOURS: 6,
  MAX_ROWS: 5000,
  TABLES: {
    ART_CATALOG: ['Artc ID','Title','Description','Price','Image URL','Status','Booking URL','Category','Artwork Type','Stock Qty','Medium','Dimensions','Gallery URLs','Featured','Updated At','Admin Notes'],
    CUSTOMERS: ['ID','Full Name','Email','Phone','Password Hash','Password Salt','Role','Registered On','Account Status','Marketing Consent','Last Login','Session Version','Staff Notes'],
    ORDER_REQUESTS: ['Order ID','Created At','Customer ID','Full Name','Email','Phone','Item Summary','Items JSON','Subtotal INR','Shipping INR','Total INR','Recipient Name','Address','City','State','PIN Code','Payment Status','Order Status','Tracking Details','Staff Notes','Inventory Applied','Request Key','Updated At'],
    ART_ENQUIRIES: ['Enquiry ID','Created At','Customer ID','Full Name','Email','Phone','Artwork Type','Description','Reference Image URL','Budget INR','Requested Date','Status','Staff Notes','Updated At'],
    SITE_CONTENT: ['Content ID','Title','Details','Link','Email','Category','Audience','Status','Start At','End At','Created At'],
    EXPERIENCES: ['Experience ID','Title','Description','Category','Price INR','Duration','Meeting Point','Image URL','Contact URL','Operator Name','Operator Contact','Availability','Permissions Verified','Verifier','Verified On','Status','Updated At'],
    TFC_REQUESTS: ['Request ID','Created At','Customer ID','Full Name','Email','Phone','Request Type','Experience ID','Preferred Date','Party Size','Message','Status','Staff Response','Meeting Point','Assigned Staff','Updated At'],
    TFC_FEEDBACK: ['Feedback ID','Created At','Customer ID','Full Name','Email','Experience ID','Rating 1–5','Feedback','Public Display Consent','Moderation Status','Staff Notes'],
    TFC_INFORMATION: ['Info ID','Section','Title','Details','Address or Meeting Point','Verified Contact','Source / Verification Note','Verified By','Verified On','Status','Updated At'],
    SETTINGS: ['Setting','Value','Notes']
  }
});

/** Public read-only endpoints. Credentials and private dashboards require POST. */
function doGet(e) {
  try {
    const action=String(e&&e.parameter&&e.parameter.action||'bootstrap').trim().toLowerCase();
    if(action==='app') return HtmlService.createTemplateFromFile('Index').evaluate().setTitle('Rak.Hi Arts · Rakhi Sharma').addMetaTag('viewport','width=device-width, initial-scale=1');
    if(action==='health') return respond_({ok:true,version:APP.VERSION},e);
    const data=apiBootstrap('');
    if(action==='bootstrap') return respond_(data,e);
    if(action==='getart'||action==='getproducts') return respond_({ok:true,products:data.products},e);
    if(action==='getexperiences') return respond_({ok:true,experiences:data.experiences},e);
    if(action==='getinformation') return respond_({ok:true,information:data.info},e);
    if(action==='getcontent') return respond_({ok:true,content:data.content},e);
    return respond_({ok:false,error:'Invalid GET action.'},e);
  } catch(err) { return respond_({ok:false,error:String(err&&err.message||err)},e); }
}

/** POST JSON actions. Passwords and private tokens are never accepted through GET. */
function doPost(e) {
  try {
    const data=JSON.parse(String(e&&e.postData&&e.postData.contents||'{}'));
    const action=String(data.action||data.type||'').replace(/[^a-z]/gi,'').toLowerCase();
    let result;
    switch(action) {
      case 'signup': case 'register': case 'registeruser': result=apiRegister(data); break;
      case 'verifyemail': result=apiVerifyEmail(data); break;
      case 'login': result=apiLogin(data); break;
      case 'logout': result=apiLogout(data.token); break;
      case 'dashboard': case 'getdashboard': result=apiCustomerDashboard(data.token); break;
      case 'updateprofile': result=apiUpdateProfile(data.token,data); break;
      case 'changepassword': result=apiChangePassword(data.token,data); break;
      case 'startpasswordreset': result=apiStartPasswordReset(data); break;
      case 'completepasswordreset': result=apiCompletePasswordReset(data); break;
      case 'submitorder': case 'createorder': result=apiSubmitOrder(data.token,data); break;
      case 'artenquiry': case 'submitartenquiry': result=apiSubmitArtEnquiry(data); break;
      case 'tfcrequest': case 'submittfcrequest': result=apiSubmitTfcRequest(data); break;
      case 'feedback': case 'submitfeedback': result=apiSubmitFeedback(data); break;
      case 'admindashboard': result=apiAdminDashboard(data.token); break;
      case 'adminupdate': result=apiAdminUpdate(data.token,data); break;
      default: throw new Error('Invalid POST action.');
    }
    return respond_(result);
  } catch(err) { return respond_({ok:false,error:String(err&&err.message||err)}); }
}

/** Optional JSONP is restricted to public GET responses. */
function respond_(value,e) {
  const json=JSON.stringify(value),callback=String(e&&e.parameter&&e.parameter.callback||'');
  if(callback&&/^[A-Za-z_$][\w$.]{0,100}$/.test(callback))
    return ContentService.createTextOutput(callback+'('+json+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Rak.Hi Platform')
    .addItem('Initialize Apps Script','initialize')
    .addItem('Re-check sheet headers','verifySetup')
    .addToUi();
}

/** Run once in the bound spreadsheet's Apps Script editor; authorizes Sheets and Mail. */
function initialize() {
  const book=SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error('Open the Apps Script project from the Google Sheet (Extensions → Apps Script).');
  const props=PropertiesService.getScriptProperties();
  props.setProperty(APP.DB_PROPERTY,book.getId());
  if (!props.getProperty(APP.SECRET_PROPERTY)) props.setProperty(APP.SECRET_PROPERTY,Utilities.getUuid()+Utilities.getUuid()+Utilities.getUuid());
  if (!props.getProperty(APP.SESSION_HOURS_PROPERTY)) props.setProperty(APP.SESSION_HOURS_PROPERTY,String(APP.DEFAULT_SESSION_HOURS));
  ensureTables_(book);
  SpreadsheetApp.getUi().alert('Apps Script connected. Create and verify the owner’s customer account, then set that account’s Role to Administrator in CUSTOMERS.');
}
function verifySetup() {
  const book=db_();
  const missing=[];
  Object.keys(APP.TABLES).forEach(name=>{
    const sh=book.getSheetByName(name);
    if(!sh){missing.push('Missing sheet: '+name);return;}
    const found=sh.getRange(1,1,1,APP.TABLES[name].length).getDisplayValues()[0];
    if(APP.TABLES[name].some((h,i)=>found[i]!==h)) missing.push('Header mismatch in '+name+'; restore the workbook’s row 1 headers.');
  });
  if(missing.length)throw new Error(missing.join('\n'));
  SpreadsheetApp.getUi().alert('All required tabs and headers are present.');
}
function apiBootstrap(token){
  const products=readRows_(sheet_('ART_CATALOG')).filter(r=>String(r.Status).toLowerCase()==='published'&&Number(r['Stock Qty'])>0).map(r=>pick_(r,['Artc ID','Title','Description','Price','Image URL','Status','Booking URL','Category','Artwork Type','Stock Qty','Medium','Dimensions','Gallery URLs','Featured']));
  const experiences=readRows_(sheet_('EXPERIENCES')).filter(r=>String(r.Status).toLowerCase()==='published'&&String(r['Permissions Verified']).toLowerCase()==='yes'&&String(r.Availability).toLowerCase()==='available').map(r=>pick_(r,['Experience ID','Title','Description','Category','Price INR','Duration','Meeting Point','Image URL','Contact URL','Operator Name','Availability']));
  const info=readRows_(sheet_('TFC_INFORMATION')).filter(r=>String(r.Status).toLowerCase()==='published'&&r['Verified By']&&r['Verified On']).map(r=>pick_(r,['Section','Title','Details','Address or Meeting Point','Verified Contact','Source / Verification Note','Verified On']));
  const content=readRows_(sheet_('SITE_CONTENT')).filter(r=>isPublished_(r)).filter(r=>audiencePublic_(r.Audience)).map(r=>pick_(r,['Title','Details','Link','Category']));
  let user=null;
  try{const account=requireUser_(token);user=publicUser_(account);}catch(ignore){}
  return {ok:true,brand:{name:getSetting_('Platform Name','Rakhi Sharma'),art:getSetting_('Art Brand','Rak.Hi Arts'),tfc:getSetting_('TFC Brand','Orchha with Rakhi'),phone:getSetting_('Contact Phone','9219862077'),instagram:publicHttps_(getSetting_('Instagram',''))},products,experiences,info,content,user,payments:'Contact Rakhi directly; online payments are not connected.'};
}
function apiRegister(data){
  const name=safeText_(data&&data.fullName,100),email=validateEmail_(data&&data.email),phone=safeText_(data&&data.phone||'',30),password=data&&data.password;
  if(typeof password!=='string'||password.length<12||password.length>128)throw new Error('Use a password between 12 and 128 characters.');
  limit_('register',email,3,3600);
  if(MailApp.getRemainingDailyQuota()<1)throw new Error('Registration email quota is unavailable. Please try again later or contact Rakhi.');
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
    if(readRows_(sheet_('CUSTOMERS')).some(r=>email_(r.Email)===email))throw new Error('An account already exists for this email. Sign in or contact Rakhi for help.');
    const id=newId_(),salt=newId_()+newId_();
    append_('CUSTOMERS',{'ID':id,'Full Name':name,'Email':email,'Phone':phone,'Password Hash':passwordHash_(password,salt),'Password Salt':salt,'Role':'Customer','Registered On':new Date(),'Account Status':'Pending verification','Marketing Consent':data.marketingConsent===true?'Yes':'No','Last Login':'','Session Version':1,'Staff Notes':''});
    const code=otp_();CacheService.getScriptCache().put(verifyKey_(email,code),id,600);
    try{MailApp.sendEmail({to:email,subject:'Verify your Rak.Hi Arts account',body:'Your Rak.Hi Arts verification code is '+code+'. It expires in 10 minutes. If you did not request this account, ignore this message.'});}
    catch(e){deleteById_('CUSTOMERS',id);throw new Error('We could not send verification email. Please contact Rakhi or try later.');}
    return {ok:true,needsVerification:true,message:'A 6-digit verification code has been sent to your email. It expires in 10 minutes.'};
  }finally{lock.releaseLock();}
}
function apiVerifyEmail(data){
  const email=validateEmail_(data&&data.email),code=String(data&&data.code||'').trim();
  if(!/^\d{6}$/.test(code))throw new Error('Enter the 6-digit code from your email.');
  limit_('verify',email,10,900);
  const cache=CacheService.getScriptCache(),key=verifyKey_(email,code),id=cache.get(key);
  if(!id)throw new Error('That code is incorrect or expired. Request a new verification email.');
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try{const user=readRows_(sheet_('CUSTOMERS')).find(r=>String(r.ID)===id&&email_(r.Email)===email);if(!user||String(user['Account Status']).toLowerCase()!=='pending verification')throw new Error('This account cannot be verified. Contact Rakhi for help.');updateById_('CUSTOMERS',id,{'Account Status':'Active'});cache.remove(key);return {ok:true,message:'Email verified. You can sign in now.'};}finally{lock.releaseLock();}
}
function apiLogin(data){
  const email=validateEmail_(data&&data.email),password=data&&data.password;
  if(typeof password!=='string'||password.length>128)throw new Error('Email or password is incorrect.');
  limit_('login',email,10,3600);
  const user=readRows_(sheet_('CUSTOMERS')).find(r=>email_(r.Email)===email);
  if(!user||String(user['Account Status']).toLowerCase()!=='active'||!user['Password Salt']||!same_(passwordHash_(password,String(user['Password Salt'])),String(user['Password Hash']||''))) throw new Error('Email or password is incorrect. If this is a new account, verify your email first.');
  const token=newId_()+newId_(),hours=Math.min(6,Math.max(1,Number(getSetting_('Customer Session Hours',APP.DEFAULT_SESSION_HOURS))||APP.DEFAULT_SESSION_HOURS));
  CacheService.getScriptCache().put(sessionKey_(token),JSON.stringify({id:String(user.ID),version:Number(user['Session Version'])||1}),hours*3600);
  updateById_('CUSTOMERS',user.ID,{'Last Login':new Date()});
  return {ok:true,token,user:publicUser_(user)};
}
function apiLogout(token){if(token)CacheService.getScriptCache().remove(sessionKey_(String(token)));return {ok:true};}
function apiStartPasswordReset(data){
  const email=validateEmail_(data&&data.email);limit_('passwordreset',email,3,3600);const generic={ok:true,message:'If an active account exists for that email, a reset code has been sent.'};const user=readRows_(sheet_('CUSTOMERS')).find(r=>email_(r.Email)===email&&String(r['Account Status']).toLowerCase()==='active');if(!user||MailApp.getRemainingDailyQuota()<1)return generic;const code=otp_();CacheService.getScriptCache().put('reset_'+digest_(email+'|'+code),String(user.ID),600);MailApp.sendEmail({to:email,subject:'Reset your Rak.Hi Arts password',body:'Your Rak.Hi Arts password reset code is '+code+'. It expires in 10 minutes. If you did not request this, ignore this email.'});return generic;
}
function apiCompletePasswordReset(data){
  const email=validateEmail_(data&&data.email),code=String(data&&data.code||'').trim(),password=data&&data.newPassword;if(!/^\d{6}$/.test(code)||typeof password!=='string'||password.length<12||password.length>128)throw new Error('Check the code and use a new password between 12 and 128 characters.');limit_('resetverify',email,8,900);const cache=CacheService.getScriptCache(),key='reset_'+digest_(email+'|'+code),id=cache.get(key);if(!id)throw new Error('That reset code is incorrect or expired.');const user=readRows_(sheet_('CUSTOMERS')).find(r=>String(r.ID)===id&&email_(r.Email)===email&&String(r['Account Status']).toLowerCase()==='active');if(!user)throw new Error('This account cannot be reset. Contact Rakhi.');const salt=newId_()+newId_();updateById_('CUSTOMERS',user.ID,{'Password Salt':salt,'Password Hash':passwordHash_(password,salt),'Session Version':(Number(user['Session Version'])||1)+1});cache.remove(key);return {ok:true,message:'Password reset. Sign in with your new password.'};
}
function apiCustomerDashboard(token){
  const user=requireUser_(token),email=email_(user.Email),id=String(user.ID);
  const orders=readRows_(sheet_('ORDER_REQUESTS')).filter(r=>email_(r.Email)===email).map(r=>pick_(r,['Order ID','Created At','Item Summary','Subtotal INR','Shipping INR','Total INR','Payment Status','Order Status','Tracking Details','Updated At']));
  const art=readRows_(sheet_('ART_ENQUIRIES')).filter(r=>email_(r.Email)===email).map(r=>pick_(r,['Enquiry ID','Created At','Artwork Type','Description','Requested Date','Status','Updated At']));
  const tfc=readRows_(sheet_('TFC_REQUESTS')).filter(r=>email_(r.Email)===email).map(r=>pick_(r,['Request ID','Created At','Request Type','Preferred Date','Party Size','Message','Status','Staff Response','Updated At']));
  const notices=readRows_(sheet_('SITE_CONTENT')).filter(r=>isPublished_(r)&&noticeForUser_(r,user)).map(r=>pick_(r,['Title','Details','Link','Category','Created At']));
  return {ok:true,user:publicUser_(user),orders,art,tfc,notices};
}
function apiUpdateProfile(token,data){const user=requireUser_(token),name=safeText_(data&&data.fullName,100),phone=safeText_(data&&data.phone||'',30);updateById_('CUSTOMERS',user.ID,{'Full Name':name,'Phone':phone});return {ok:true};}
function apiChangePassword(token,data){
  const user=requireUser_(token),old=data&&data.oldPassword,next=data&&data.newPassword;
  if(typeof old!=='string'||!same_(passwordHash_(old,String(user['Password Salt'])),String(user['Password Hash']||'')))throw new Error('Current password is incorrect.');
  if(typeof next!=='string'||next.length<12||next.length>128)throw new Error('Use a new password between 12 and 128 characters.');
  const salt=newId_()+newId_();updateById_('CUSTOMERS',user.ID,{'Password Salt':salt,'Password Hash':passwordHash_(next,salt),'Session Version':(Number(user['Session Version'])||1)+1});return {ok:true};
}
function apiSubmitOrder(token,data){
  const user=requireUser_(token),items=data&&data.items;
  if(!Array.isArray(items)||items.length<1||items.length>20)throw new Error('Your cart is empty or contains too many different artworks.');
  const key=safeText_(data.requestKey,80);if(!/^[A-Za-z0-9-]{12,80}$/.test(key))throw new Error('Please refresh your bag and try again.');
  const recipient=safeText_(data.recipientName,100),address=safeText_(data.address,250),city=safeText_(data.city,100),state=safeText_(data.state,100),pin=safeText_(data.pin,10);
  if(!/^\d{6}$/.test(pin))throw new Error('Enter a valid 6-digit India PIN code.');
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
    const orders=readRows_(sheet_('ORDER_REQUESTS')),prior=orders.find(r=>String(r['Request Key'])===key&&email_(r.Email)===email_(user.Email));if(prior)return {ok:true,orderId:prior['Order ID'],message:'This order request has already been received.'};
    const catalog=readRows_(sheet_('ART_CATALOG')),merged=new Map();
    items.forEach(it=>{const id=safeText_(it.id,100),qty=Number(it.quantity);if(!Number.isInteger(qty)||qty<1||qty>10)throw new Error('Check the quantity selected for each artwork.');merged.set(id,(merged.get(id)||0)+qty);});
    if([...merged.values()].some(q=>q>10))throw new Error('Maximum quantity is 10 per artwork.');
    let subtotal=0;const lines=[];
    for(const [id,qty] of merged){const p=catalog.find(r=>String(r['Artc ID'])===id);if(!p||String(p.Status).toLowerCase()!=='published'||Number(p['Stock Qty'])<qty)throw new Error('An artwork is no longer available in that quantity. Please refresh your bag.');const price=Number(p.Price);if(!Number.isFinite(price)||price<0)throw new Error('Rakhi is updating this artwork listing. Please try later.');subtotal+=price*qty;lines.push({id,title:safeText_(p.Title,160),unitPrice:price,quantity:qty,lineTotal:price*qty});}
    const shipping='',total='',orderId='ORD-'+newId_().replace(/-/g,'').slice(0,12).toUpperCase(),now=new Date(),summary=lines.map(x=>x.title+' × '+x.quantity).join('; ');
    append_('ORDER_REQUESTS',{'Order ID':orderId,'Created At':now,'Customer ID':user.ID,'Full Name':user['Full Name'],'Email':email_(user.Email),'Phone':user.Phone,'Item Summary':summary,'Items JSON':JSON.stringify(lines),'Subtotal INR':subtotal,'Shipping INR':shipping,'Total INR':total,'Recipient Name':recipient,'Address':address,'City':city,'State':state,'PIN Code':pin,'Payment Status':'Arrange directly','Order Status':'New','Tracking Details':'','Staff Notes':'Delivery and final quote to confirm with customer.','Inventory Applied':'No','Request Key':key,'Updated At':now});
    return {ok:true,orderId,message:'Your order request has been sent. Rakhi will confirm availability, delivery and payment directly. The request is not yet an accepted order.'};
  }finally{lock.releaseLock();}
}
function apiSubmitArtEnquiry(data){
  const email=validateEmail_(data&&data.email);limit_('artenquiry',email,4,3600);
  const name=safeText_(data&&data.name,100),phone=safeText_(data&&data.phone||'',30),kind=safeText_(data&&data.artworkType||'Custom artwork',80),description=safeText_(data&&data.description,2000),url=httpsUrl_(data&&data.referenceImageUrl,true),budget=optionalMoney_(data&&data.budget),when=safeText_(data&&data.requestedDate||'',20),u=data&&data.token?optionalUser_(data.token):null;
  if(description.length<12)throw new Error('Please add a few details about your idea.');append_('ART_ENQUIRIES',{'Enquiry ID':'ART-'+newId_().slice(0,8).toUpperCase(),'Created At':new Date(),'Customer ID':u?u.ID:'','Full Name':name,'Email':email,'Phone':phone,'Artwork Type':kind,'Description':description,'Reference Image URL':url,'Budget INR':budget,'Requested Date':when,'Status':'New','Staff Notes':'','Updated At':new Date()});return {ok:true,message:'Your art enquiry has been sent. Rakhi will discuss the details with you.'};
}
function apiSubmitTfcRequest(data){
  const email=validateEmail_(data&&data.email);limit_('tfc',email,4,3600);const name=safeText_(data&&data.name,100),phone=safeText_(data&&data.phone||'',30),kind=safeText_(data&&data.requestType||'Visitor assistance',80),experienceId=safeText_(data&&data.experienceId||'',100),when=safeText_(data&&data.preferredDate||'',20),party=Math.max(1,Math.min(100,Number(data&&data.partySize)||1)),message=safeText_(data&&data.message,2000),u=data&&data.token?optionalUser_(data.token):null;
  if(message.length<12)throw new Error('Please tell Rakhi a little about your visit or what you need.');if(experienceId&&!readRows_(sheet_('EXPERIENCES')).some(r=>String(r['Experience ID'])===experienceId&&String(r.Status).toLowerCase()==='published'&&String(r['Permissions Verified']).toLowerCase()==='yes'))throw new Error('This experience needs to be reconfirmed. Please send a general visit enquiry instead.');
  const id='TFC-'+newId_().slice(0,8).toUpperCase();append_('TFC_REQUESTS',{'Request ID':id,'Created At':new Date(),'Customer ID':u?u.ID:'','Full Name':name,'Email':email,'Phone':phone,'Request Type':kind,'Experience ID':experienceId,'Preferred Date':when,'Party Size':party,'Message':message,'Status':'New','Staff Response':'','Meeting Point':'','Assigned Staff':'','Updated At':new Date()});return {ok:true,message:'Your visitor enquiry has been received. Rakhi will contact you. This is not a confirmed booking.'};
}
function apiSubmitFeedback(data){
  const email=validateEmail_(data&&data.email);limit_('feedback',email,3,3600);const rating=Number(data&&data.rating);if(!Number.isInteger(rating)||rating<1||rating>5)throw new Error('Select a rating from 1 to 5.');const u=data&&data.token?optionalUser_(data.token):null;
  append_('TFC_FEEDBACK',{'Feedback ID':'FDB-'+newId_().slice(0,8).toUpperCase(),'Created At':new Date(),'Customer ID':u?u.ID:'','Full Name':safeText_(data&&data.name,100),'Email':email,'Experience ID':safeText_(data&&data.experienceId||'',100),'Rating 1–5':rating,'Feedback':safeText_(data&&data.feedback,1200),'Public Display Consent':data&&data.publicConsent===true?'Yes':'No','Moderation Status':'Pending review','Staff Notes':''});return {ok:true,message:'Thank you for sharing your feedback. It will be reviewed before appearing publicly.'};
}
function apiAdminDashboard(token){
  requireAdmin_(token,['Administrator','Content Manager','Tourism Operator']);const user=requireUser_(token),role=String(user.Role);
  const admin=role==='Administrator',artAllowed=admin||role==='Content Manager',tfcAllowed=admin||role==='Tourism Operator';
  return {ok:true,role,products:artAllowed?readRows_(sheet_('ART_CATALOG')).map(r=>pick_(r,APP.TABLES.ART_CATALOG.filter(h=>h!=='Admin Notes'))):[],orders:admin?readRows_(sheet_('ORDER_REQUESTS')).map(r=>pick_(r,APP.TABLES.ORDER_REQUESTS.filter(h=>!['Items JSON','Staff Notes','Request Key'].includes(h)))):[],art:admin?readRows_(sheet_('ART_ENQUIRIES')).map(r=>pick_(r,APP.TABLES.ART_ENQUIRIES.filter(h=>h!=='Staff Notes'))):[],tfc:tfcAllowed?readRows_(sheet_('TFC_REQUESTS')).map(r=>pick_(r,APP.TABLES.TFC_REQUESTS.filter(h=>!['Staff Response','Assigned Staff'].includes(h)))):[],feedback:tfcAllowed?readRows_(sheet_('TFC_FEEDBACK')).map(r=>pick_(r,APP.TABLES.TFC_FEEDBACK.filter(h=>h!=='Staff Notes'))):[],content:artAllowed?readRows_(sheet_('SITE_CONTENT')):[],experiences:tfcAllowed?readRows_(sheet_('EXPERIENCES')):[],information:tfcAllowed?readRows_(sheet_('TFC_INFORMATION')):[]};
}
function apiAdminUpdate(token,data){
  const actor=requireAdmin_(token,['Administrator','Content Manager','Tourism Operator']);const type=safeText_(data&&data.type,30),id=safeText_(data&&data.id,100),status=safeText_(data&&data.status,50);
  const allowed={orders:['New','Accepted','In progress','Ready for dispatch','Dispatched','Completed','Cancelled'],payment:['Arrange directly','Awaiting confirmation','Confirmed','Refunded'],art:['New','Contacted','In progress','Completed','Closed'],tfc:['New','Contacted','Confirmed','Closed'],feedback:['Pending review','Approved','Rejected'],experiences:['Draft','Published','Unavailable'],information:['Draft','Published','Archived'],content:['Draft','Published','Archived']};
  if(!allowed[type]||!allowed[type].includes(status))throw new Error('That update is not allowed.');if((type==='orders'||type==='payment'||type==='art')&&String(actor.Role).toLowerCase()!=='administrator')throw new Error('Only an administrator can manage customer orders and private art enquiries.');if((type==='tfc'||type==='feedback'||type==='experiences'||type==='information')&&String(actor.Role).toLowerCase()==='content manager')throw new Error('Your account cannot manage TFC records.');if(type==='content'&&!['administrator','content manager'].includes(String(actor.Role).toLowerCase()))throw new Error('Your account cannot publish customer notices.');
  const name=({orders:'ORDER_REQUESTS',payment:'ORDER_REQUESTS',art:'ART_ENQUIRIES',tfc:'TFC_REQUESTS',feedback:'TFC_FEEDBACK',experiences:'EXPERIENCES',information:'TFC_INFORMATION',content:'SITE_CONTENT'})[type],idHeader=APP.TABLES[name][0];const lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
    const row=readRows_(sheet_(name)).find(r=>String(r[idHeader])===id);if(!row)throw new Error('Record not found.');const patch={};let current=statusOf_(type,row);
    if(type==='orders'){
      if(!validOrderTransition_(current,status))throw new Error('This order cannot move from '+current+' to '+status+'.');
      const items=JSON.parse(String(row['Items JSON']||'[]'));const stock=sheet_('ART_CATALOG');
      if(status==='Accepted'&&String(row['Inventory Applied']).toLowerCase()!=='yes'){
        const products=readRows_(stock);for(const item of items){const p=products.find(x=>String(x['Artc ID'])===String(item.id));if(!p||String(p.Status).toLowerCase()!=='published'||Number(p['Stock Qty'])<Number(item.quantity))throw new Error('Insufficient stock for '+item.title+'. Contact the customer before accepting this request.');}
        const changed=[];try{for(const item of items){const p=products.find(x=>String(x['Artc ID'])===String(item.id));updateById_('ART_CATALOG',p['Artc ID'],{'Stock Qty':Number(p['Stock Qty'])-Number(item.quantity),'Updated At':new Date()});changed.push({id:p['Artc ID'],qty:Number(item.quantity)});}}catch(err){for(const c of changed){const fresh=readRows_(stock).find(x=>String(x['Artc ID'])===String(c.id));if(fresh)updateById_('ART_CATALOG',c.id,{'Stock Qty':Number(fresh['Stock Qty'])+c.qty});}throw err;}
        patch['Inventory Applied']='Yes';
      }
      if(status==='Cancelled'&&String(row['Inventory Applied']).toLowerCase()==='yes'){
        const products=readRows_(stock),changed=[];try{for(const item of items){const p=products.find(x=>String(x['Artc ID'])===String(item.id));if(p){updateById_('ART_CATALOG',p['Artc ID'],{'Stock Qty':Number(p['Stock Qty'])+Number(item.quantity),'Updated At':new Date()});changed.push({id:p['Artc ID'],qty:Number(item.quantity)});}}}catch(err){for(const c of changed){const fresh=readRows_(stock).find(x=>String(x['Artc ID'])===String(c.id));if(fresh)updateById_('ART_CATALOG',c.id,{'Stock Qty':Number(fresh['Stock Qty'])-c.qty});}throw err;}
        patch['Inventory Applied']='No';
      }
      patch['Order Status']=status;patch['Updated At']=new Date();if(status==='Accepted')patch['Payment Status']='Awaiting confirmation';
      if(status==='Completed'&&String(row['Inventory Applied']).toLowerCase()==='yes')for(const item of items){const p=readRows_(stock).find(x=>String(x['Artc ID'])===String(item.id));if(p&&String(p['Artwork Type']).toLowerCase()==='original'&&Number(p['Stock Qty'])===0)updateById_('ART_CATALOG',p['Artc ID'],{'Status':'Sold','Updated At':new Date()});}
    } else if(type==='payment'){if(status==='Confirmed'&&(String(row['Order Status'])==='New'||String(row['Order Status'])==='Cancelled'||String(row['Inventory Applied']).toLowerCase()!=='yes'))throw new Error('Accept the request and reserve stock before confirming payment.');if(status==='Confirmed'){const ship=Number(row['Shipping INR']),total=Number(row['Total INR']);if(!Number.isFinite(ship)||ship<0||!Number.isFinite(total)||total<0||Math.abs(total-(Number(row['Subtotal INR'])+ship))>0.01)throw new Error('Enter the confirmed shipping fee and final total in the Sheet before marking payment confirmed.');}if(status==='Refunded'&&String(row['Payment Status'])!=='Confirmed')throw new Error('Only a manually confirmed payment can be marked refunded.');patch['Payment Status']=status;patch['Updated At']=new Date();}
    else if(type==='art')Object.assign(patch,{Status:status,'Updated At':new Date()});
    else if(type==='tfc')Object.assign(patch,{Status:status,'Updated At':new Date(),'Staff Response':safeText_(data.note||row['Staff Response']||'',1000)});
    else if(type==='feedback')patch['Moderation Status']=status;
    else if(type==='experiences'){patch.Status=status;patch['Updated At']=new Date();if(status==='Published'&&String(row['Permissions Verified']).toLowerCase()!=='yes')throw new Error('Verify the operator permissions before publishing this experience.');}
    else if(type==='information'){patch.Status=status;patch['Updated At']=new Date();if(status==='Published'&&(!row['Verified By']||!row['Verified On']))throw new Error('Add verifier and verification date before publishing visitor information.');}
    else {patch.Status=status;if(status==='Published'&&String(row.Audience).toLowerCase()==='everyone'&&String(row.Category).toLowerCase().includes('safety')&&!row['Email'])throw new Error('Safety notices require a named verified recipient or clear verification notes before publication.');}
    updateById_(name,row[idHeader],patch);return {ok:true,message:'Record updated.'};
  } finally {lock.releaseLock();}
}
function apiAdminProfile(token){const u=requireAdmin_(token,['Administrator','Content Manager','Tourism Operator']);return publicUser_(u);}

// Storage, validation and access-control helpers. Never expose a sheet read/write API to the browser.
function ensureTables_(book){Object.keys(APP.TABLES).forEach(name=>{let s=book.getSheetByName(name);if(!s)s=book.insertSheet(name);const required=APP.TABLES[name];if(s.getLastRow()===0)s.getRange(1,1,1,required.length).setValues([required]);const actual=s.getRange(1,1,1,required.length).getDisplayValues()[0];const mismatch=required.some((h,i)=>{if(name==='SETTINGS'&&i===0){const value=String(actual[i]||'').trim().toLowerCase();return value!==''&&value!=='setting';}return actual[i]!==h;});if(mismatch)throw new Error('Header mismatch: '+name+'. Keep the supplied first-row column headers unchanged.');});}
function db_(){const id=PropertiesService.getScriptProperties().getProperty(APP.DB_PROPERTY);if(!id)throw new Error('Run initialize() from the bound Apps Script project first.');return SpreadsheetApp.openById(id);}
function sheet_(name){const sh=db_().getSheetByName(name);if(!sh||!APP.TABLES[name])throw new Error('A required sheet is missing: '+name);return sh;}
function readRows_(sh){const last=Math.min(sh.getLastRow(),APP.MAX_ROWS);if(last<2)return[];const h=sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0];if(sh.getName()==='SETTINGS'&&!String(h[0]||'').trim())h[0]='Setting';return sh.getRange(2,1,last-1,h.length).getValues().map(row=>{const o={};h.forEach((k,i)=>o[k]=row[i] instanceof Date?row[i].toISOString():row[i]);return o;}).filter(r=>Object.values(r).some(v=>v!==''&&v!==null));}
function append_(name,values){const sh=sheet_(name),headers=APP.TABLES[name];const row=headers.map(k=>{const v=Object.prototype.hasOwnProperty.call(values,k)?values[k]:'';return typeof v==='string'?safeCell_(v):v;});sh.appendRow(row);return row;}
function updateById_(name,id,values){const sh=sheet_(name),headers=APP.TABLES[name];if(sh.getLastRow()<2)throw new Error('Record not found.');const rows=sh.getRange(2,1,sh.getLastRow()-1,headers.length).getDisplayValues();for(let i=0;i<rows.length;i++)if(String(rows[i][0])===String(id)){const target=sh.getRange(i+2,1,1,headers.length),next=target.getValues()[0];for(const [key,value] of Object.entries(values)){const index=headers.indexOf(key);if(index<0)throw new Error('Unknown field '+key);next[index]=typeof value==='string'?safeCell_(value):value;}target.setValues([next]);return;}throw new Error('Record not found.');}
function deleteById_(name,id){const sh=sheet_(name),r=readRows_(sh).findIndex(x=>String(x[APP.TABLES[name][0]])===String(id));if(r>=0)sh.deleteRow(r+2);}
function pick_(row,keys){const out={};keys.forEach(k=>{if(Object.prototype.hasOwnProperty.call(row,k))out[k]=row[k];});return out;}
function publicUser_(u){return pick_(u,['ID','Full Name','Email','Phone','Role','Registered On']);}
function getSetting_(key,defaultValue){const r=readRows_(sheet_('SETTINGS')).find(x=>String(x.Setting)===String(key));return r&&r.Value!==''?r.Value:defaultValue;}
function publicHttps_(value){const s=String(value||'').trim();return /^https:\/\//i.test(s)&&s.length<=1000?s:'';}
function safeCell_(value){const s=String(value);return /^[=+@]/.test(s)?"'"+s:s;}
function safeText_(value,max){if(typeof value!=='string'&&typeof value!=='number')throw new Error('Please complete the required fields.');const s=String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,'').trim();if(s.length>max)throw new Error('One of the fields is too long.');return s;}
function email_(v){return String(v||'').trim().toLowerCase();}
function validateEmail_(value){const e=safeText_(value,254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))throw new Error('Enter a valid email address.');return e;}
function httpsUrl_(value,optional){const s=String(value||'').trim();if(!s&&optional)return '';if(!/^https:\/\//i.test(s)||s.length>1000)throw new Error('Image and reference links must use HTTPS.');try{const u=new URL(s);if(!u.hostname)throw new Error();return u.href;}catch(e){throw new Error('Enter a valid HTTPS link.');}}
function optionalMoney_(v){if(v===''||v===null||v===undefined)return '';const n=Number(v);if(!Number.isFinite(n)||n<0||n>10000000)throw new Error('Enter a valid non-negative budget.');return n;}
function newId_(){return Utilities.getUuid();}
function otp_(){const n=parseInt(newId_().replace(/-/g,'').slice(0,8),16)%1000000;return ('000000'+n).slice(-6);}
function passwordHash_(password,salt){const secret=PropertiesService.getScriptProperties().getProperty(APP.SECRET_PROPERTY);if(!secret)throw new Error('Authentication is not initialized.');return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(String(salt)+'\0'+String(password),secret));}
function same_(a,b){a=String(a);b=String(b);let d=a.length^b.length;const n=Math.max(a.length,b.length);for(let i=0;i<n;i++)d|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return d===0;}
function digest_(v){return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(v)));}
function sessionKey_(token){return 'session_'+digest_(token);}
function verifyKey_(email,code){return 'verify_'+digest_(email+'|'+code);}
function requireUser_(token){if(typeof token!=='string'||token.length<30||token.length>150)throw new Error('Please sign in to continue.');const session=CacheService.getScriptCache().get(sessionKey_(token));if(!session)throw new Error('Your session expired. Please sign in again.');let auth;try{auth=JSON.parse(session);}catch(e){throw new Error('Your session expired. Please sign in again.');}const u=readRows_(sheet_('CUSTOMERS')).find(r=>String(r.ID)===String(auth.id)&&String(r['Account Status']).toLowerCase()==='active'&&(Number(r['Session Version'])||1)===Number(auth.version));if(!u)throw new Error('Your account is inactive. Please contact Rakhi.');return u;}
function optionalUser_(token){try{return requireUser_(String(token));}catch(e){return null;}}
function requireAdmin_(token,roles){const u=requireUser_(token);if(!roles.map(x=>x.toLowerCase()).includes(String(u.Role).toLowerCase()))throw new Error('This action is limited to authorised staff.');return u;}
function limit_(kind,email,max,seconds){const cache=CacheService.getScriptCache(),k='limit_'+kind+'_'+digest_(email),n=Number(cache.get(k)||'0')+1;if(n>max)throw new Error('Too many attempts. Please wait and try again later.');cache.put(k,String(n),seconds);}
function isPublished_(r){const now=Date.now();return String(r.Status).toLowerCase()==='published'&&(!r['Start At']||Date.parse(r['Start At'])<=now)&&(!r['End At']||Date.parse(r['End At'])>now);}
function audiencePublic_(v){return ['everyone','all users'].includes(String(v||'').trim().toLowerCase());}
function noticeForUser_(r,u){if(audiencePublic_(r.Audience))return true;if(email_(r.Email)&&email_(r.Email)===email_(u.Email))return true;const a=String(r.Audience||'').toLowerCase(),role=String(u.Role||'').toLowerCase();return a==='customers'||a==='art customers'&&role==='customer'||a==='tfc visitors'&&role==='customer';}
function statusOf_(type,r){return type==='payment'?String(r['Payment Status']||''):type==='orders'?String(r['Order Status']||''):String(r.Status||r['Moderation Status']||'');}
function validOrderTransition_(from,to){const transitions={'New':['Accepted','Cancelled'],'Accepted':['In progress','Ready for dispatch','Dispatched','Completed','Cancelled'],'In progress':['Ready for dispatch','Dispatched','Completed','Cancelled'],'Ready for dispatch':['Dispatched','Completed','Cancelled'],'Dispatched':['Completed'],'Completed':[],'Cancelled':[]};return from===to||(transitions[from]||[]).includes(to);}


/** Apps Script HTML Service bridge: same-origin reads and writes for Index.html. */
function include(filename){return HtmlService.createHtmlOutputFromFile(filename).getContent();}
function gsPublic(action){
  try{const data=apiBootstrap('');action=String(action||'bootstrap').toLowerCase();
    if(action==='bootstrap')return data;
    if(action==='getart'||action==='getproducts')return {ok:true,products:data.products};
    if(action==='getexperiences')return {ok:true,experiences:data.experiences};
    if(action==='getinformation')return {ok:true,information:data.info};
    if(action==='getcontent')return {ok:true,content:data.content};
    if(action==='health')return {ok:true,version:APP.VERSION};
    return {ok:false,error:'Invalid GET action.'};
  }catch(err){return {ok:false,error:String(err&&err.message||err)};}
}
function gsApi(data){
  try{data=data||{};const action=String(data.action||data.type||'').replace(/[^a-z]/gi,'').toLowerCase();let result;
    switch(action){
      case 'signup':case 'register':case 'registeruser':result=apiRegister(data);break;
      case 'verifyemail':result=apiVerifyEmail(data);break;
      case 'login':result=apiLogin(data);break;
      case 'logout':result=apiLogout(data.token);break;
      case 'dashboard':case 'getdashboard':result=apiCustomerDashboard(data.token);break;
      case 'updateprofile':result=apiUpdateProfile(data.token,data);break;
      case 'changepassword':result=apiChangePassword(data.token,data);break;
      case 'startpasswordreset':result=apiStartPasswordReset(data);break;
      case 'completepasswordreset':result=apiCompletePasswordReset(data);break;
      case 'submitorder':case 'createorder':result=apiSubmitOrder(data.token,data);break;
      case 'artenquiry':case 'submitartenquiry':result=apiSubmitArtEnquiry(data);break;
      case 'tfcrequest':case 'submittfcrequest':result=apiSubmitTfcRequest(data);break;
      case 'feedback':case 'submitfeedback':result=apiSubmitFeedback(data);break;
      case 'admindashboard':result=apiAdminDashboard(data.token);break;
      case 'adminupdate':result=apiAdminUpdate(data.token,data);break;
      default:throw new Error('Invalid POST action.');
    }return result;
  }catch(err){return {ok:false,error:String(err&&err.message||err)};}
}
