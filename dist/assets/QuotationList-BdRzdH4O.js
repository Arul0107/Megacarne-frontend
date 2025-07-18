import{r as A,an as z,x as e,B as V,S as ne,K as ae,V as U,ao as Z,H as le,T as de,ap as pe,aq as E}from"./index-C36zvvcm.js";import{i as W}from"./axios-YBtE4rUB.js";import{h as G}from"./moment-C5S46NFB.js";import{D as ce}from"./index-BwsntrwW.js";import{T as oe}from"./index-Cw82aFj5.js";import{D as ge,d as xe}from"./index-BmFF9ec6.js";import{I as ie,R as me}from"./index-CuxO1eeJ.js";import{D as Y}from"./index-CDn_GbkA.js";import{L as X}from"./index-DCLihlHH.js";import{R as re}from"./MessageOutlined-DoH-0oy-.js";import{E as ue,h as q,R as fe}from"./html2canvas.esm-Dk564b21.js";import{c as he}from"./TextArea-DtjF0uRf.js";import{F as M}from"./Table-CnpPxd61.js";import{M as ye}from"./index-63B_X4_q.js";import{D as v}from"./index-HLezmO2f.js";import{T as B}from"./index-CbEnRtJ1.js";import{R as ee}from"./PrinterOutlined-qJGbRCUq.js";import{R as be}from"./ScheduleOutlined-D_qGaO4l.js";import{R as we}from"./EditOutlined-BVz_vn0b.js";import{P as ve}from"./index-vTk9Z3Bp.js";import{R as Ne}from"./DeleteOutlined-BoVYtpom.js";import"./context-CmgXdBfZ.js";import"./useClosable-CI-max__.js";import"./styleChecker-BpbLeVBU.js";import"./index-B1a6yg1P.js";import"./dayjs.min-BaNyTlmQ.js";import"./Pagination-CM6ZKb6g.js";import"./addEventListener-DnRuTxp0.js";import"./index-amHpvK7D.js";import"./InfoCircleFilled-DlJl_SXM.js";import"./ActionButton-CG1yLPda.js";import"./index-Qs47g3Pi.js";const{TextArea:je}=ie,{Text:Q}=oe,Ie=({visible:n,onClose:g,quotation:a,refreshQuotations:p})=>{const[f,N]=A.useState(""),[m,x]=A.useState(null),[y,c]=A.useState(!1),[r,h]=A.useState([]),[d,b]=A.useState(null),[L,S]=A.useState([]),[j,k]=A.useState(!1),$=()=>{try{const s=JSON.parse(localStorage.getItem("user"));return(s==null?void 0:s.email)||"Unknown"}catch{return"Unknown"}};A.useEffect(()=>{n&&(a!=null&&a._id)?(D(),C()):(h([]),b(null),N(""),x(null),S([]))},[n,a]);const C=async()=>{k(!0);try{const s=await W.get("/api/users");Array.isArray(s.data)?S(s.data):(console.warn("API for users did not return an array:",s.data),S([]))}catch(s){console.error("Failed to fetch users:",s),z.error("Could not load user details for display."),S([])}finally{k(!1)}},F=s=>{if(!s)return"Unknown User";if(typeof s=="object"&&s!==null)return s.name||s.email||"Unknown User";const u=L.find(t=>t._id===s||t.id===s);return u?u.name||u.email||`User ID: ${s}`:`Unknown User (ID: ${s})`},D=async()=>{if(a!=null&&a._id){c(!0);try{const s=await W.get(`/api/quotations/${a._id}/followups`);h(s.data.sort((u,t)=>G(t.createdAt).diff(G(u.createdAt))))}catch(s){console.error("Error fetching follow-ups:",s),z.error("Failed to fetch follow-ups.")}finally{c(!1)}}},P=async()=>{if(!m||!f.trim()){z.error("Please select a date and enter a note for the follow-up.");return}c(!0);try{let s;const u=JSON.parse(localStorage.getItem("user")),t=(u==null?void 0:u._id)||(u==null?void 0:u.id);if(!t){z.error("User information not found. Please log in."),c(!1);return}const o={date:G(m).toISOString(),note:f.trim(),addedBy:t};d===null?s=W.post(`/api/quotations/${a._id}/followups`,o):s=W.put(`/api/quotations/${a._id}/followups/${d._id}`,o),s.then(()=>{z.success(d===null?"Follow-up added successfully!":"Follow-up updated successfully!"),N(""),x(null),b(null),D(),typeof p=="function"&&p()}).catch(i=>{var l,w;console.error("Error saving follow-up:",i),z.error(`Error saving follow-up: ${((w=(l=i.response)==null?void 0:l.data)==null?void 0:w.message)||i.message}`)}).finally(()=>{c(!1)})}catch(s){console.error("Error preparing follow-up data:",s),z.error("An unexpected error occurred."),c(!1)}},R=s=>e.jsx(X.Item,{children:e.jsxs("div",{style:{backgroundColor:"#f0f2f5",borderRadius:"12px",padding:"10px 15px",maxWidth:"calc(100% - 80px)",flexGrow:1},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",marginBottom:"5px"},children:[e.jsx(ae,{style:{marginRight:"5px",color:"#888"}}),e.jsx(Q,{strong:!0,style:{marginRight:"10px",color:"#333"},children:F(s.addedBy)}),e.jsx(xe,{style:{marginRight:"5px",color:"#888"}}),e.jsx(Q,{type:"secondary",style:{fontSize:"0.8em"},children:G(s.createdAt).format("DD/MM/YYYY, h:mm:ss A")})]}),e.jsxs("div",{style:{display:"flex",alignItems:"flex-start"},children:[e.jsx(re,{style:{marginRight:"8px",marginTop:"3px",color:"#555"}}),e.jsx(Q,{style:{flexGrow:1},children:s.note})]})]})});return e.jsxs(ce,{title:`Follow-ups for Quotation: ${(a==null?void 0:a.quotationNumber)||"N/A"}`,open:n,onClose:()=>{b(null),N(""),x(null),g()},width:720,children:[e.jsxs("div",{style:{marginBottom:20},children:[e.jsxs(Q,{type:"secondary",style:{marginBottom:8,display:"block",fontSize:"0.9em"},children:["Adding follow-up as: ",e.jsx(Q,{strong:!0,children:$()})]}),e.jsx(ge,{style:{width:"100%",marginBottom:8},format:"DD-MM-YYYY",value:m,onChange:s=>x(s),placeholder:"Select follow-up date"}),e.jsx(je,{rows:4,placeholder:"Enter follow-up note",value:f,onChange:s=>N(s.target.value)}),e.jsx(V,{type:"primary",style:{marginTop:10,backgroundColor:"#ef7a1b",borderColor:"#ef7a1b",color:"white"},block:!0,onClick:P,loading:y,children:d===null?"Add Follow-up":"Update Follow-up"})]}),e.jsxs(Y,{children:["All Follow-ups (",r.length,")"]}),y||j?e.jsx("div",{style:{textAlign:"center",padding:"20px"},children:e.jsx(ne,{size:"large",tip:"Loading Follow-ups..."})}):e.jsx(X,{dataSource:r,renderItem:R,locale:{emptyText:"No follow-ups found for this quotation."},style:{marginTop:16}})]})},H=n=>`₹${(parseFloat(n)||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`,Se=n=>{if(typeof n!="number"||isNaN(n))return"N/A";let g=Math.floor(n),a=Math.round((n-g)*100);const p=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"],f=["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],N=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],m=["","Thousand","Lakh","Crore"],x=d=>d<10?p[d]:d>=10&&d<20?f[d-10]:N[Math.floor(d/10)]+(d%10!==0?" "+p[d%10]:"");let y=[],c=0;if(g===0)y.push("Zero");else{let d=g%1e3;for(d>0&&(d<100?y.push(x(d)):y.push(p[Math.floor(d/100)]+" Hundred"+(d%100!==0?" "+x(d%100):""))),g=Math.floor(g/1e3);g>0;){let b=g%100;b>0?y.push(x(b)+" "+m[++c]):c++,g=Math.floor(g/100)}}const r=y.reverse().filter(Boolean).join(" ").trim();let h=r?r+" Rupees":"Zero Rupees";return a>0&&(h+=` and ${x(a)} Paisa`),h+=" Only",h.replace(/\s+/g," ")},Ae=n=>{var k,$,C,F,D,P,R,s,u,t,o;const g=((k=n.items)==null?void 0:k.reduce((i,l)=>i+(l.quantity||0)*(l.rate||0),0))||0,p=g*.18,f=g+p,N=Z,m=Z,x=(($=n.businessId)==null?void 0:$.contactName)||n.contactName||"N/A",y=n.mobileNumber||((C=n.businessId)==null?void 0:C.mobileNumber)||((F=n.businessId)==null?void 0:F.phone)||"N/A",c=((D=n.businessId)==null?void 0:D.email)||n.email||"N/A",r=((P=n.businessId)==null?void 0:P.gstin)||n.gstin||"N/A",h=((s=(R=n.businessId)==null?void 0:R.address)==null?void 0:s.replace(/\n/g,"<br>"))||((u=n.businessInfo)==null?void 0:u.replace(/\n/g,"<br>"))||"N/A",d=`
    <div style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <div style="display: flex; align-items: center;">
         <img src="${N}" alt="Company Logo" style="width: 200px; height: 70px; margin-right: 15px;">
          <div>
            <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #2c3e50; margin-bottom: 5px;">ACE AUTOMATION</h2>
            <p style="margin: 2px 0; font-size: 10px; color: #555;">S.F. No. 91, 14B, Padiveedu Thottam,</p>
            <p style="2px 0; font-size: 10px; color: #555;">Kalapatty road, Saravanampatti (PO),</p>
            <p style="margin: 2px 0; font-size: 10px; color: #555;">Coimbatore - 641 035. TN, INDIA.</p>
            <p style="margin: 2px 0; font-size: 10px; color: #555;">+91 98422 53389 | aceautomation.cbe@gmail.com</p>
            <p style="2px 0; font-size: 10px; color: #555;">www.aceautomation.in | GST No. : 33AVDPD3093Q1ZD</p>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #ff6600, #ff8c00); color: white; padding: 15px 25px; font-weight: 600; font-size: 20px; text-align: center; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          QUOTATION
        </div>
      </div>
      <div style="border-bottom: 2px solid #eee; margin-bottom: 15px;"></div>
    </div>
  `,b=`
    <div style="padding: 15px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); background: white;">
      ${d}

      <div style="margin-bottom: 20px; background: #f9fafb; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; width: 25%; background: #f0f2f5;">Company Name</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px; width: 25%;">
              ${n.businessName||"N/A"}
            </td>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; width: 25%; background: #f0f2f5;">Date</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px; width: 25%;">
              ${n.date?new Date(n.date).toLocaleDateString("en-IN"):new Date().toLocaleDateString("en-IN")}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; background: #f0f2f5;">Contact Person</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px;">
              ${x}
            </td>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; background: #f0f2f5;">Quotation No</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px;">
              ${n.quotationNumber||"N/A"}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; background: #f0f2f5;">Contact Number</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px;">
              ${y} </td>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; background: #f0f2f5;">Customer GST No.</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px;">
              ${r}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; background: #f0f2f5;">Contact Email</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px;" colspan="3">
              ${c}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; background: #f0f2f5;">Address</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px;" colspan="3">
              ${h}
            </td>
          </tr>
        </table>
      </div>

      ${((t=n.items)==null?void 0:t.length)>0?`
          <div style="margin-top: 20px; overflow: hidden; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed; font-size: 12px;">
              <colgroup>
                <col style="width: 5%;"> <col style="width: 20%;"> <col style="width: 25%;"> <col style="width: 10%;"> <col style="width: 17.5%;"> <col style="width: 17.5%;"> </colgroup>
              <thead>
                <tr style="background: linear-gradient(135deg, #2c3e50, #34495e); color: white;">
                  <th style="border: 1px solid #2c3e50; padding: 8px; text-align: center;">S.No</th>
                  <th style="border: 1px solid #2c3e50; padding: 8px; text-align: left;">Product Name</th>
                  <th style="border: 1px solid #2c3e50; padding: 8px; text-align: left;">Specification</th>
                  <th style="border: 1px solid #2c3e50; padding: 8px; text-align: center;">Quantity</th>
                  <th style="border: 1px solid #2c3e50; padding: 8px; text-align: right;">Unit Price (₹)</th>
                  <th style="border: 1px solid #2c3e50; padding: 8px; text-align: right;">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${n.items.map((i,l)=>{var O;const w=(i==null?void 0:i.productName)||"N/A";let T=(i==null?void 0:i.description)||"";!T&&((O=i.specifications)==null?void 0:O.length)>0&&(T=i.specifications.map(K=>`${K.name}: ${K.value}`).join(", ")),T=T||"N/A";const _=parseFloat(i.quantity)||0,J=parseFloat(i.rate)||0,se=(_*J).toFixed(2);return`
                      <tr style="${l%2===0?"background: #fff;":"background: #f9fafb;"}">
                        <td style="border: 1px solid #e0e0e0; padding: 8px; text-align: center; vertical-align: top;">${l+1}</td>
                        <td style="border: 1px solid #e0e0e0; padding: 8px; text-align: left; vertical-align: top;">
                          ${w}
                        </td>
                        <td style="border: 1px solid #e0e0e0; padding: 8px; text-align: left; vertical-align: top;">
                          ${T}
                        </td>
                        <td style="border: 1px solid #e0e0e0; padding: 8px; text-align: center; vertical-align: top;">
                          ${_}
                        </td>
                        <td style="border: 1px solid #e0e0e0; padding: 8px; text-align: right; vertical-align: top;">${H(J)}</td>
                        <td style="border: 1px solid #e0e0e0; padding: 8px; text-align: right; font-weight: 600; vertical-align: top;">
                          ${H(parseFloat(se))}
                        </td>
                      </tr>
                    `}).join("")}
              </tbody>
            </table>
          </div>

          <div style="margin-top: 15px; background: #f9fafb; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr>
                <td style="width: 70%;"></td>
                <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: right; font-weight: 600; width: 15%; background: #f0f2f5;">Sub Total</td>
                <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: right; font-weight: 600; width: 15%;">${H(g)}</td>
              </tr>
              <tr>
                <td style="width: 70%;"></td>
                <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: right; width: 15%; background: #f0f2f5;">GST (18%)</td>
                <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: right; width: 15%;">${H(p)}</td>
              </tr>
              <tr style="background: #e8f5e9;">
                <td style="width: 70%;"></td>
                <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: right; font-weight: 600; font-size: 13px; width: 15%;">Total Amount</td>
                <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: right; font-weight: 600; font-size: 13px; width: 15%;">${H(f)}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 15px; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr>
                <td style="font-weight: 600; padding: 4px; width: 25%; color: #555;">Amount In Words</td>
                <td style="padding: 4px; font-style: italic; width: 75%;">${Se(f)}</td>
              </tr>
            </table>
          </div>
        `:""}

      <div style="margin-top: 20px; font-size: 12px; color: #555;">
        <p style="margin: 5px 0; font-style: italic; color: #666;">"We appreciate your business inquiry and look forward to serving you with our quality products and services."</p>

        <div style="margin: 15px 0;">
          <p style="margin: 5px 0; font-weight: 600; color: #2c3e50;">With Best Regards</p>
          <p style="5px 0; color: #555;">For Ace Automation</p>
        </div>
      </div>

      <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        <div style="text-align: right;">
          <img src="${m}" alt="Authorized Signature" style="height: 60px; display: block; margin-left: auto; margin-bottom: 5px;">
          <p style="margin: 5px 0; font-size: 12px; font-weight: 600; color: #2c3e50;">Authorized Signatory</p>
        </div>
      </div>
      <p style="text-align: center; font-size: 10px; color: #999; margin-top: 20px;">Page 1/2</p>
    </div>
  `,L=(o=n.items)==null?void 0:o.filter(i=>i.specifications&&i.specifications.length>0).map(i=>{const w=`- ${i.productName||i.description||"Product"}`,T=i.specifications.map(_=>`
          <tr>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; width: 40%; background: #f9f9f9; vertical-align: top;">${_.name||""}</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px; vertical-align: top;">${_.value||""}</td>
          </tr>
        `).join("");return`
        <div style="margin-bottom: 20px; background: #f9fafb; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #2c3e50, #34495e); color: white; padding: 8px 12px; font-weight: 600; font-size: 13px;">
            PRODUCT SPECIFICATIONS ${w}
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tbody>
              ${T}
            </tbody>
          </table>
        </div>
      `}).join(""),S=`
    <div style="margin-top: 20px; background: #f9fafb; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #2c3e50, #34495e); color: white; padding: 8px 12px; font-weight: 600; font-size: 13px;">
        GENERAL TERMS & CONDITIONS
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tbody>
          <tr>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; width: 30%; background: #f0f2f5; vertical-align: top;">Payment Terms</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px; vertical-align: top;">${n.Payment||"50% advance, 50% on delivery"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; width: 30%; background: #f0f2f5; vertical-align: top;">Delivery Period</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px; vertical-align: top;">${n.Delivery?`${n.Delivery} days`:"Within 15 working days after advance"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; width: 30%; background: #f0f2f5; vertical-align: top;">Warranty</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px; vertical-align: top;">${n.Warranty?`${n.Warranty} year(s)`:"1 year from the date of invoice"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; width: 30%; background: #f0f2f5; vertical-align: top;">Freight</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px; vertical-align: top;">${n.Freight||"Extra as per actual"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #e0e0e0; padding: 8px; font-weight: 600; width: 30%; background: #f0f2f5; vertical-align: top;">Validity</td>
            <td style="border: 1px solid #e0e0e0; padding: 8px; vertical-align: top;">${n.Validity||"30 days from the date of quotation"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,j=`
    <div style="padding: 15px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); background: white;">
      ${d}

      ${L}

      ${S}

      <div style="margin-top: 20px; font-size: 12px; color: #555;">
        <p style="margin: 5px 0; font-style: italic; color: #666;">"Thank you for considering our proposal. We assure you of our best services and support at all times."</p>

        <div style="margin: 15px 0;">
          <p style="margin: 5px 0; font-weight: 600; color: #2c3e50;">With Best Regards</p>
          <p style="5px 0; color: #555;">For Ace Automation</p>
        </div>
      </div>

      <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        <div style="text-align: right;">
          <img src="${m}" alt="Authorized Signature" style="height: 60px; display: block; margin-left: auto; margin-bottom: 5px;">
          <p style="margin: 5px 0; font-size: 12px; font-weight: 600; color: #2c3e50;">Authorized Signatory</p>
        </div>
      </div>
      <p style="text-align: center; font-size: 10px; color: #999; margin-top: 20px;">Page 2/2</p>
    </div>
  `;return{page1Html:b,page2Html:j}},te=async n=>{const g=U.loading("Generating PDF...",{position:"top-center"});let a=null,p=null;try{const{page1Html:f,page2Html:N}=Ae(n),m=new ue({orientation:"portrait",unit:"mm",format:"a4",hotfixes:["px_scaling"]}),x=m.internal.pageSize.getWidth(),y=m.internal.pageSize.getHeight(),c=7;a=document.createElement("div"),a.style.position="fixed",a.style.top="-9999px",a.style.left="-9999px",a.style.width=`${x-2*c}mm`,a.style.padding="0",a.style.background="white",a.style.zIndex="-1",a.style.display="block",a.innerHTML=f,document.body.appendChild(a),await new Promise($=>setTimeout($,200));const h=(await q(a,{scale:2,useCORS:!0,logging:!1,allowTaint:!0,letterRendering:!0,backgroundColor:"#ffffff"})).toDataURL("image/jpeg",.8),d=m.getImageProperties(h),b=d.height*(x-2*c)/d.width;m.addImage(h,"JPEG",c,c,x-2*c,b),m.addPage(),p=document.createElement("div"),p.style.position="fixed",p.style.top="-9999px",p.style.left="-9999px",p.style.width=`${x-2*c}mm`,p.style.padding="0",p.style.background="white",p.style.zIndex="-1",p.style.display="block",p.innerHTML=N,document.body.appendChild(p),await new Promise($=>setTimeout($,200));const S=(await q(p,{scale:2,useCORS:!0,logging:!1,allowTaint:!0,letterRendering:!0,backgroundColor:"#ffffff"})).toDataURL("image/jpeg",.8),j=m.getImageProperties(S),k=j.height*(x-2*c)/j.width;m.addImage(S,"JPEG",c,c,x-2*c,k),m.save(`${n.quotationNumber||"quotation"}_${new Date().toISOString().slice(0,10)}.pdf`),U.success("PDF downloaded successfully!",{id:g})}catch(f){console.error("Failed to generate PDF:",f),U.error("Failed to generate PDF. Please try again.",{id:g})}finally{a&&document.body.contains(a)&&document.body.removeChild(a),p&&document.body.contains(p)&&document.body.removeChild(p)}},{Text:I}=oe,st=({quotations:n,onAddNew:g,onEdit:a,onDelete:p,onSearch:f,onViewNotes:N,loading:m,refreshQuotations:x})=>{var C,F,D,P,R,s,u;const[y,c]=A.useState(!1),[r,h]=A.useState(null),[d,b]=A.useState(!1),L=t=>{h(t),c(!0),U.success("Quotation details loaded.",{duration:1500,position:"top-right"})},S=t=>{h(t),b(!0)},j=t=>`₹${(parseFloat(t)||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`,k=()=>[{title:"S.No",width:60,align:"center",render:(t,o,i)=>i+1},{title:"Product Name",dataIndex:"productName",ellipsis:!0,render:(t,o)=>(console.log("Item in QuotationList:",o),t||o.name||"N/A")},{title:"Description",dataIndex:"description",ellipsis:!0,render:(t,o)=>{var i;if(!t&&((i=o.specifications)==null?void 0:i.length)>0){const l=o.specifications.find(w=>w.name==="SPECIFICATION");return l?l.value:"N/A"}return t||"N/A"}},{title:"HSN/SAC",dataIndex:"hsnSac",width:100,align:"center",render:t=>t||"N/A"},{title:"Qty",dataIndex:"quantity",width:80,align:"center",render:t=>parseFloat(t)||0},{title:"Unit Price (₹)",width:140,align:"right",render:(t,o)=>j(o.rate||0)},{title:"Total (₹)",width:140,align:"right",render:(t,o)=>e.jsx(I,{strong:!0,style:{color:"#52c41a"},children:j((o.quantity||0)*(o.rate||0))})}],$=[{title:"Quotation #",dataIndex:"quotationNumber",render:t=>e.jsx(B,{color:"blue",children:t||"N/A"}),sorter:(t,o)=>(t.quotationNumber||"").localeCompare(o.quotationNumber||"")},{title:"Business",dataIndex:"businessName",sorter:(t,o)=>(t.businessName||"").localeCompare(o.businessName||"")},{title:"Customer",dataIndex:"customerName",render:(t,o)=>{var i,l,w;return e.jsxs("div",{children:[e.jsx("div",{children:((i=o.businessId)==null?void 0:i.contactName)||t||"N/A"}),(((l=o.businessId)==null?void 0:l.email)||o.customerEmail)&&e.jsx("div",{style:{fontSize:12,color:"#666"},children:((w=o.businessId)==null?void 0:w.email)||o.customerEmail})]})},sorter:(t,o)=>{var i,l;return(((i=t.businessId)==null?void 0:i.contactName)||t.customerName||"").localeCompare(((l=o.businessId)==null?void 0:l.contactName)||o.customerName||"")}},{title:"Items Count",render:(t,o)=>{var i,l;return e.jsxs(B,{color:"geekblue",children:[((i=o.items)==null?void 0:i.length)||0," item",(((l=o.items)==null?void 0:l.length)||0)!==1?"s":""]})}},{title:"Latest Note",dataIndex:"notes",render:t=>{if(t&&t.length>0){const o=t[t.length-1],i=o.text.length>30?`${o.text.substring(0,30)}...`:o.text;return e.jsx(de,{title:o.text,children:e.jsx(I,{type:"secondary",children:i})})}return e.jsx(I,{type:"secondary",italic:!0,children:"No notes"})}},{title:"Total (₹)",dataIndex:"total",render:(t,o)=>{var l;const i=parseFloat(t)||((l=o.items)==null?void 0:l.reduce((w,T)=>w+(T.quantity||0)*(T.rate||0),0))||0;return e.jsx(I,{strong:!0,style:{color:"#52c41a"},children:j(i)})},sorter:(t,o)=>{const i=parseFloat(t.total)||0,l=parseFloat(o.total)||0;return i-l}},{title:"Date",dataIndex:"date",render:t=>{if(!t)return"N/A";try{return new Date(t).toLocaleDateString("en-IN")}catch{return t}},sorter:(t,o)=>{const i=new Date(t.date).getTime()||0,l=new Date(o.date).getTime()||0;return i-l}},{title:"Actions",width:80,render:(t,o)=>e.jsx(pe,{overlay:e.jsxs(E,{children:[e.jsx(E.Item,{icon:e.jsx(me,{}),onClick:()=>L(o),children:"View Details"},"view"),e.jsx(E.Item,{icon:e.jsx(ee,{}),onClick:()=>te(o),children:"Download PDF"},"download"),e.jsx(E.Item,{icon:e.jsx(re,{}),onClick:()=>{N(o),U.success("Opening notes dialog...",{duration:1500})},children:"View/Add Notes"},"notes"),e.jsx(E.Item,{icon:e.jsx(be,{}),onClick:()=>S(o),children:"Add/View Follow-ups"},"followups"),e.jsx(E.Item,{icon:e.jsx(we,{}),onClick:()=>{a(o),U.success("Initiating quotation edit...",{duration:1500})},children:"Edit Quotation"},"edit"),e.jsx(E.Item,{children:e.jsxs(ve,{title:"Are you sure you want to delete this account?",onConfirm:()=>p(o._id),okText:"Yes",cancelText:"No",children:[e.jsx(Ne,{}),"Delete Quotation"]})})]}),trigger:["click"],children:e.jsx(V,{icon:e.jsx(fe,{})})})}];return e.jsxs(e.Fragment,{children:[e.jsx(le,{style:{marginBottom:16,justifyContent:"space-between",width:"10%"},children:e.jsx(ie.Search,{placeholder:"Search by quotation number, business, customer, or notes...",onChange:t=>{f(t.target.value)},style:{width:200},prefix:e.jsx(he,{}),allowClear:!0})}),e.jsx("div",{className:"table",children:e.jsx(V,{type:"primary",onClick:()=>{g(),U.success("Prepare to create a new quotation.",{duration:1500})},children:"+ New Quotation"})}),e.jsx(M,{columns:$,dataSource:n,rowKey:"_id",loading:m,pagination:{pageSize:10,showSizeChanger:!0,showQuickJumper:!0,showTotal:(t,o)=>`${o[0]}-${o[1]} of ${t} quotations`},scroll:{x:1200}}),e.jsx(ye,{title:e.jsxs("div",{children:[e.jsx(I,{strong:!0,children:"Quotation Details"}),r&&e.jsx(B,{color:"blue",style:{marginLeft:8},children:r.quotationNumber})]}),open:y,onCancel:()=>c(!1),footer:[e.jsx(V,{icon:e.jsx(ee,{}),onClick:()=>te(r),children:"Download PDF"},"download"),e.jsx(V,{onClick:()=>c(!1),children:"Close"},"close")],width:1e3,children:r&&e.jsxs("div",{id:`quotation-modal-preview-${r._id}`,children:[e.jsxs(v,{column:2,bordered:!0,size:"small",children:[e.jsx(v.Item,{label:"Quotation Number",children:e.jsx(B,{color:"blue",children:r.quotationNumber||"N/A"})}),e.jsx(v.Item,{label:"Date",children:r.date?new Date(r.date).toLocaleDateString("en-IN"):"N/A"}),e.jsxs(v.Item,{label:"Status",children:[" ",e.jsx(B,{color:r.status==="Approved"?"green":r.status==="Pending"?"orange":r.status==="Rejected"?"red":"blue",className:"rounded-full px-3 py-1 text-sm font-medium",children:r.status||"N/A"})]}),e.jsx(v.Item,{label:"Business Name",children:r.businessName||"N/A"}),e.jsx(v.Item,{label:"Contact Person",children:((C=r.businessId)==null?void 0:C.contactName)||r.customerName||"N/A"}),e.jsx(v.Item,{label:"Customer Email",children:((F=r.businessId)==null?void 0:F.email)||r.customerEmail||"N/A"}),e.jsx(v.Item,{label:"Mobile Number",children:r.mobileNumber||((D=r.businessId)==null?void 0:D.mobileNumber)||((P=r.businessId)==null?void 0:P.phone)||"N/A"}),e.jsx(v.Item,{label:"GSTIN",children:e.jsx(I,{code:!0,children:r.gstin||"N/A"})}),e.jsx(v.Item,{label:"Business Info",span:2,children:e.jsx(I,{style:{whiteSpace:"pre-wrap"},children:r.businessInfo||"N/A"})}),e.jsx(v.Item,{label:"Total Amount",span:2,children:e.jsx(I,{style:{fontSize:"18px",fontWeight:"bold",color:"#52c41a"},children:j(r.total||((R=r.items)==null?void 0:R.reduce((t,o)=>t+(o.quantity||0)*(o.rate||0),0))||0)})})]}),((s=r.items)==null?void 0:s.length)>0&&e.jsxs(e.Fragment,{children:[e.jsxs(Y,{orientation:"left",children:["Items (",r.items.length,")"]}),e.jsx(M,{dataSource:r.items,columns:k(),pagination:!1,size:"small",rowKey:(t,o)=>`${r._id}-item-${o}`,bordered:!0,expandable:{expandedRowRender:t=>{var o;return e.jsx("div",{style:{margin:0,padding:0},children:((o=t.specifications)==null?void 0:o.length)>0&&e.jsx(v,{column:1,size:"small",children:t.specifications.filter(i=>i.name!=="SPECIFICATION").map((i,l)=>e.jsx(v.Item,{label:i.name,children:i.value},l))})})},rowExpandable:t=>{var o;return((o=t.specifications)==null?void 0:o.length)>0}},summary:t=>{const o=t.reduce((i,l)=>i+(l.quantity||0)*(l.rate||0),0);return e.jsx(M.Summary,{fixed:!0,children:e.jsxs(M.Summary.Row,{children:[e.jsxs(M.Summary.Cell,{index:0,colSpan:6,children:[" ",e.jsx(I,{strong:!0,children:"Grand Total:"})]}),e.jsxs(M.Summary.Cell,{index:6,children:[" ",e.jsx(I,{strong:!0,style:{color:"#52c41a"},children:j(o)})]})]})})}})]}),((u=r.notes)==null?void 0:u.length)>0&&e.jsxs(e.Fragment,{children:[e.jsxs(Y,{orientation:"left",children:["Notes (",r.notes.length,")"]}),r.notes.map((t,o)=>e.jsxs("div",{style:{marginBottom:12,padding:8,background:"#f5f5f5",borderRadius:4},children:[e.jsxs(I,{italic:!0,children:['"',t.text,'"']}),e.jsx("br",{}),e.jsxs(I,{type:"secondary",style:{fontSize:"0.8em"},children:["— ",t.author," on"," ",t.timestamp||new Date(r.createdAt).toLocaleDateString("en-IN")]})]},o))]})]})}),r&&e.jsx(Ie,{visible:d,onClose:()=>b(!1),quotation:r,refreshQuotations:x})]})};export{st as default};
