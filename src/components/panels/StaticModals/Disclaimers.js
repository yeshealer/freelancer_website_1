// React
import React from 'react';
import { withRouter } from 'react-router-dom';

class Disclaimers extends React.Component {
  render() {
    return (
      <div style={{ position: 'fixed' }} className={'fullScreenModal Stats-Table desktopAboutModal'}>
        <span
          onClick={() => {
            this.props.history.goBack();
          }} className="exit-img-icon-modal"
        />
        <div className="customScrollbar">
          <div className="innerSidePadding">
            <div className="innerSidePadding" style={{ direction: 'ltr', fontFamily: 'Etelka-Light' }}>
                <span>
                  <h1>DISCLAIMERS</h1>
                  <p>
                  THE INTERNATIONAL PERFORMANCE HUB "IPH" HEREBY DISCLAIMS THE WARRANTIES TO THE FULL EXTENT PERMITTED BY LAW. ALL WARRANTIES OF ANY KIND RELATED TO THE SITE, DATA, MATERIALS, EITHER EXPRESSED OR IMPLIED, INCLUDING, WITHOUT LIMITATION, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT WITH RESPECT TO THE ACCURACY, CORRECTNESS, ADEQUACY OR COMPLETENESS OR UP TO DATE OF ANY DATA AND MATERIAL OBTAINED FROM THIS WEBSITE, OR DATA PROVIDERS ON THIS SITE. THE IPH ASSUMES NO LIABILITY OR RESPONSIBILITY THAT THE WEBSITE WILL OPERATE IN AN UNINTERRUPTED OR ERROR-FREE MANNER OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. UNDER NO CIRCUMSTANCES SHALL THE IPH BE LIABLE FOR ANY LOSS OR DAMAGES, LIABILITY OR EXPENSE INCURRED OR SUFFERED EITHER ACTUAL OR CONSEQUENTIAL, WHETHER FORESEEABLE OR UNFORESEEABLE, (INCLUDING, WITHOUT LIMITATION, ANY FAULT, OMISSION, ERRORS, LOSS OF DATA, OR INTERRUPTION OR DELAY IN AVAILABILITY OF DATA WITHIN IPH OR DATA PROVIDERS), ARISING OUT OF OR RELATING TO THE USE OF THIS WEBSITE, OR TO YOUR USE OR INABILITY TO USE A SITE, OR TO YOUR RELIANCE UPON INFORMATION OBTAINED FROM OR THROUGH A SITE. NOR SHALL THEY BE RESPONSIBLE FOR ANY FAILURE OF PERFORMANCE OR COMMUNICATION LINE OR COMPUTER VIRUS, REGARDLESS OF CAUSE, OR FOR ANY DAMAGES RESULTING THEREFROM. USE OF THIS WEBSITE IS AT THE USER'S SOLE RISK.
                  </p>
                  <p>
                  THE IPH SHALL NOT BE LIABLE FOR THE CONTENTS OF ANY LINKED SITE, OTHER DATA PROVIDERS OR ANY LINK CONTAINED IN A LINKED SITE(S) WHICH IS ONLY PROVIDED FOR CONVENIENCE AND AN INCLUSION OF A LINK OR REFERENCE DOES NOT IMPLY OR CONSTRUE AS AN ENDORSEMENT OF THE LINKED SITE BY THIS WEBSITE. NO CLAIMS, PROMISES, OR GUARANTEES ABOUT THE COMPLETENESS, ACCURACY, CONTENT OR QUALITY OF INFORMATION CONTAINED IN THE LINKS TO AND FROM THIS WEBSITE ARE MADE, OR INFORMATION PROVIDED AND OPINIONS EXPRESSED BY INDIVIDUALS DO NOT NECESSARILY REPRESENT THE OPINION OF THE IPH WEBSITE. THE IPH EXPRESSLY DISCLAIMS ANY AND ALL LIABILITY RESULTING FROM RELIANCE ON SUCH INFORMATION OR CONCLUSIONS. THE FINDINGS, INTERPRETATIONS AND CONCLUSIONS OF OTHER DATA PROVIDERS EXPRESSED IN THE MATERIALS ON THIS SITE ARE THOSE OF WHO PREPARED THE WORK AND DO NOT NECESSARILY REPRESENT THE VIEWS OF THE IPH, UNLESS EXPRESSLY STATED OTHERWISE.
                  </p>
                  <p>
                  THE IPH SHALL NOT BE LIABLE FOR ANY DAMAGES IN CASE OF FOLLOWING POSSIBLE FACTUAL ERRORS IN SOURCES USED TO COLLECT THE DATA. SOME VALUES AND RANKINGS IN THE IPH WEBSITE MIGHT DIFFER FROM THE SOURCES USED TO ACQUIRE THE DATA DUE TO, BUT NOT LIMITED TO: DATA AVAILABILITY AT THE TIME OF THE REFRESH,DATA CHANGE OR OMISSIONS AT SOURCE SINCE LAST REFRESH, ROUNDING OF VALUES, DIFFERENCE IN RANKING METHODOLOGY, REVERSAL OF RANKINGS DUE TO DIFFERENCE IN KPI OBJECTIVE BEING HIGHER OR LOWER, EXCLUSION OF SOME REGIONS/COUNTRIES IN IPH SUCH AS SELF-PROCLAIMED NATIONS, AND SMALL ISLAND COUNTRIES, OR LOCAL REGIONS WITHIN A COUNTRY WHICH ARE NOT CURRENTLY TRACKED IN IPH, IMPUTATION OF OLDER VALUES AT THE SOURCE, METHODOLOGY CHANGES FOR CALCULATING SCORES AT THE SOURCE, AND ERRORS IN TRANSFERRING DATA TO THE SYSTEM INCLUDING HUMAN OR MACHINE ERROR.
                  </p>
                  <h1>TERMS AND CONDITIONS</h1>
                  <p>
                  International Performance Hub "IPH" (referred below as "the website" or "we" "or "us" or "our") provide broad public access to information and data. Your first use of this website (User's) shall be deemed to have read and accepted these terms and conditions provided herein below. If you do not accept these Terms and Conditions, please immediately discontinue the use of this website.
                  </p>
                  <p style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                  Please note: We provide our analysis and data access at our best knowledge but for non-commercial purposes only. In case you want to use the data and information for commercial purposes, please contact us in advance
                  </p>
                  <p>
                  Kindly read the Terms and Conditions carefully as the use of this website constitute your agreement to the following Terms and Conditions:
                  </p>
                  <p>
                  International Performance Hub "IPH" allow users to visit the website and may copy and download the information, data, documents and materials for only non-commercial purposes, without any right to resell or redistribute them or to collect or produce derivative works therefrom, subject to the terms and conditions drawn here below, and also subject to the specific restrictions given specifically in the documents within this website.
                  </p>
                  <p>
                  The User may not use any trademark, official mark, emblem or logo of the website or any of its other means of promotion or publicity nor in any event to represent or imply an association or affiliation with the IPH, without prior written consent.
                  </p>
                  <p>
                  The User agrees to indemnify the IPH from and against any and all claims, losses, damages, actions, liabilities including legal claims and legal fees, resulting from the use of this site or your placement of any content onto a site, including, without limitation, any claims violating these terms and conditions, and to fully cooperate in website defense against any such claims.
                  </p>
                  <p>
                  The User agrees that you will properly reference to the IPH in case of using the datasets or other materials derived from the website by citing: "Source: International Performance Hub (http:/iph.sa): Dataset/Material [2018].
                  </p>
                  <p>
                  The User agrees that, if a third party claims that any material you have incorporated from this website is illegal, in that case you will bear the burden of establishing that the material complies with all applicable laws.
                  </p>
                  <p>
                  The User is responsible for maintaining the confidentiality of account and password, and User shall be liable for all activities that occur under your account or password. In case of any unauthorized use of password or username or any other breach of security, user must immediately inform IPH to take mandatory actions.
                  </p>
                  <p>
                  You may not publicly represent or imply that this website is participating in, or has sponsored, approved, or endorsed the manner or purpose of your use or reproduction of the Materials. IPH is entitled to prosecute the matters to the fullest extent of the law if the IPH data is disparaged, falsified or misrepresented.
                  </p>
                  <p>
                  The User agrees not to do any of the following:
                  </p>
                  <ul>
                  <li>
                  Attempt to promote commercial activities such as sales, promotions, advertisements, advices related to investments or any actions which breach the securities laws.
                  </li>
                  <li>
                  Misrepresent or attempt to misrepresent the identity while using the website.
                  </li>
                  <li>
                  Violate any applicable law or encourage or incite others to do so.
                  </li>
                  <li>
                  E-mail or post, any of the content that defame, threatening and harassing statements or contents that violates any law or disseminate any defamatory, infringing the rights, obscene, indecent or unlawful material or information.
                  </li>
                  <li>
                  Upload or attach files that contain software or other materials protected by intellectual property laws unless the User owns or has the rights or consents therefor under the applicable law.
                  </li>
                  <li>
                  Upload or attach files that are corrupted or contain viruses, or software or programs that may possibly damage the operation of another's computer.
                  </li>
                  <li>
                  Delete or modify any legal notice, proprietorship, author attributions or labels in any uploaded file.
                  </li>
                  <li>
                  Interfere to damage or disrupt any part or whole website, computer, server, or database linked to the website.
                  </li>
                  </ul>
                  <p>
                  These terms and conditions are subject to modify at any time without notice. We will make you aware of such changes and your then continued use of IPH website after any changes to terms constitutes your consent to any such changes. The website reserves the right and discretion to monitor any activity and content associated with IPH site and site services and may take any appropriate action including, but not limited to, removing materials from the site or editing the contents at their sole discretion or terminate/suspend access to this website in case of violation of use of these terms and conditions.
                  </p>
                  <p>
                  These Terms and Conditions are effective from (1-January 2018)
                  </p>

                  <h1>COPYRIGHT</h1>
                  <p>
                  This website contains copyrighted material including but not limited to text, graphics, logos, icons, images, audio video clips and other multimedia, digital downloads, book publications, articles and data compilations are owned by the IPH or its content suppliers which are protected under Saudi Arabia and international copyright laws.
                  </p>
                  <p>
                  You may copy or download the published or copyrighted material available on this site subject to Terms and Conditions, in whole or in part, for non-commercial, especially educational, or commentary purposes without any editing or alteration thereby providing the complete credit and sourcing to the IPH in addition to citation of URL of respective web page from where the text was copied. Commercial use of the copyrighted material available on this site is expressly forbidden.
                  </p>

                  <h1>OWNERS OF INTELLECTUAL PROPERTY RIGHTS</h1>
                  <p>
                  Intellectual Property Rights are valued by us. We have given our best to honor such rights held by third parties. Nevertheless, if you are an owner or think to have a right of intellectual property in content displayed on the IPH website and you believe that your intellectual property has been unsuitably posted or distributed via the website, then we request you to kindly inform us by sending an email to <a
                    href="mailto:info@iph.sa"
                  >info@iph.sa</a>. We promise to work towards a fruitful solution for both sides in such a case.
                  </p>
                </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Disclaimers);
