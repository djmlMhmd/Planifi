const confirmationRDVProTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
\txmlns="http://www.w3.org/1999/xhtml"
 lang="fr">
\t<head>
\t\t<!--[if gte mso 9]>
\t\t\t<xml>
\t\t\t\t<o:OfficeDocumentSettings>
\t\t\t\t\t<o:AllowPNG />
\t\t\t\t\t<o:PixelsPerInch>96</o:PixelsPerInch>
\t\t\t\t</o:OfficeDocumentSettings>
\t\t\t</xml>
\t\t<![endif]-->
\t\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />
\t\t<meta name="x-apple-disable-message-reformatting" />
\t\t<!--[if !mso]><!-->
\t\t<meta http-equiv="X-UA-Compatible" content="IE=edge" />
\t\t<!--<![endif]-->
\t\t<title></title>

\t\t<style type="text/css">
\t\t\t@media only screen and (min-width: 620px) {
\t\t\t\t.u-row {
\t\t\t\t\twidth: 600px !important;
\t\t\t\t}
\t\t\t\t.u-row .u-col {
\t\t\t\t\tvertical-align: top;
\t\t\t\t}

\t\t\t\t.u-row .u-col-50 {
\t\t\t\t\twidth: 300px !important;
\t\t\t\t}

\t\t\t\t.u-row .u-col-100 {
\t\t\t\t\twidth: 600px !important;
\t\t\t\t}
\t\t\t}

\t\t\t@media (max-width: 620px) {
\t\t\t\t.u-row-container {
\t\t\t\t\tmax-width: 100% !important;
\t\t\t\t\tpadding-left: 0 !important;
\t\t\t\t\tpadding-right: 0 !important;
\t\t\t\t}
\t\t\t\t.u-row .u-col {
\t\t\t\t\tmin-width: 320px !important;
\t\t\t\t\tmax-width: 100% !important;
\t\t\t\t\tdisplay: block !important;
\t\t\t\t}
\t\t\t\t.u-row {
\t\t\t\t\twidth: 100% !important;
\t\t\t\t}
\t\t\t\t.u-col {
\t\t\t\t\twidth: 100% !important;
\t\t\t\t}
\t\t\t\t.u-col > div {
\t\t\t\t\tmargin: 0 auto;
\t\t\t\t}
\t\t\t}
\t\t\tbody {
\t\t\t\tmargin: 0;
\t\t\t\tpadding: 0;
\t\t\t}

\t\t\ttable,
\t\t\ttr,
\t\t\ttd {
\t\t\t\tvertical-align: top;
\t\t\t\tborder-collapse: collapse;
\t\t\t}

\t\t\tp {
\t\t\t\tmargin: 0;
\t\t\t}

\t\t\t.ie-container table,
\t\t\t.mso-container table {
\t\t\t\ttable-layout: fixed;
\t\t\t}

\t\t\t* {
\t\t\t\tline-height: inherit;
\t\t\t}

\t\t\ta[x-apple-data-detectors='true'] {
\t\t\t\tcolor: inherit !important;
\t\t\t\ttext-decoration: none !important;
\t\t\t}

\t\t\ttable,
\t\t\ttd {
\t\t\t\tcolor: #000000;
\t\t\t}
\t\t\t#u_body a {
\t\t\t\tcolor: #161a39;
\t\t\t\ttext-decoration: underline;
\t\t\t}
\t\t</style>

\t\t<!--[if !mso]><!-->
\t\t<link
\t\t\thref="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap"
\t\t\trel="stylesheet"
\t\t\ttype="text/css"
\t\t/>
\t\t<link
\t\t\thref="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap"
\t\t\trel="stylesheet"
\t\t\ttype="text/css"
\t\t/>
\t\t<!--<![endif]-->
\t</head>

\t<body
\t\tclass="clean-body u_body"
\t\tstyle="
\t\t\tmargin: 0;
\t\t\tpadding: 0;
\t\t\t-webkit-text-size-adjust: 100%;
\t\t\tbackground-color: #f9f9f9;
\t\t\tcolor: #000000;
\t\t"
\t>
\t\t<!--[if IE]><div class="ie-container"><![endif]-->
\t\t<!--[if mso]><div class="mso-container"><![endif]-->
\t\t<table
\t\t\tid="u_body"
\t\t\tstyle="
\t\t\t\tborder-collapse: collapse;
\t\t\t\ttable-layout: fixed;
\t\t\t\tborder-spacing: 0;
\t\t\t\tmso-table-lspace: 0pt;
\t\t\t\tmso-table-rspace: 0pt;
\t\t\t\tvertical-align: top;
\t\t\t\tmin-width: 320px;
\t\t\t\tmargin: 0 auto;
\t\t\t\tbackground-color: #f9f9f9;
\t\t\t\twidth: 100%;
\t\t\t"
\t\t\tcellpadding="0"
\t\t\tcellspacing="0"
\t\t>
\t\t\t<tbody>
\t\t\t\t<tr style="vertical-align: top">
\t\t\t\t\t<td
\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\tborder-collapse: collapse !important;
\t\t\t\t\t\t\tvertical-align: top;
\t\t\t\t\t\t"
\t\t\t\t\t>
\t\t\t\t\t\t<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->

\t\t\t\t\t\t<div
\t\t\t\t\t\t\tclass="u-row-container"
\t\t\t\t\t\t\tstyle="padding: 0; background-color: #f9f9f9"
\t\t\t\t\t\t>
\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\tclass="u-row"
\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\tmargin: 0 auto;
\t\t\t\t\t\t\t\t\tmin-width: 320px;
\t\t\t\t\t\t\t\t\tmax-width: 600px;
\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\tword-wrap: break-word;
\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\tbackground-color: #f9f9f9;
\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\tborder-collapse: collapse;
\t\t\t\t\t\t\t\t\t\tdisplay: table;
\t\t\t\t\t\t\t\t\t\twidth: 100%;
\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\tbackground-color: transparent;
\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0;background-color: #f9f9f9;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f9f9f9;"><![endif]-->

\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0;border-top: 0 solid transparent;border-left: 0 solid transparent;border-right: 0 solid transparent;border-bottom: 0 solid transparent;" valign="top"><![endif]-->
\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\tclass="u-col u-col-100"
\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\tmax-width: 320px;
\t\t\t\t\t\t\t\t\t\t\tmin-width: 600px;
\t\t\t\t\t\t\t\t\t\t\tdisplay: table-cell;
\t\t\t\t\t\t\t\t\t\t\tvertical-align: top;
\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\t\t\twidth: 100% !important;
\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t<!--[if (!mso)&(!IE)]><!--><div
\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\tbox-sizing: border-box;
\t\t\t\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-left: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-right: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-bottom: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t><!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t\t\t<table
\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\trole="presentation"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellpadding="0"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing="0"
\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"
\t\t\t\t\t\t\t\t\t\t\t\t\tborder="0"
\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 15px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign="left"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<table
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\theight="0"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign="center"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder="0"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcellpadding="0"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing="0"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder-collapse: collapse;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttable-layout: fixed;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder-spacing: 0;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmso-table-lspace: 0pt;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmso-table-rspace: 0pt;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvertical-align: top;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 1px
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsolid
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t#f9f9f9;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t-ms-text-size-adjust: 100%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t-webkit-text-size-adjust: 100%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvertical-align: top;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder-collapse: collapse !important;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvertical-align: top;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 0;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 0;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmso-line-height-rule: exactly;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t-ms-text-size-adjust: 100%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t-webkit-text-size-adjust: 100%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>&#160;</span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t\t\t\t</table>

\t\t\t\t\t\t\t\t\t\t\t\t<!--[if (!mso)&(!IE)]><!-->
\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t<!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]></td><![endif]-->
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>

\t\t\t\t\t\t<div
\t\t\t\t\t\t\tclass="u-row-container"
\t\t\t\t\t\t\tstyle="padding: 0; background-color: transparent"
\t\t\t\t\t\t>
\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\tclass="u-row"
\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\tmargin: 0 auto;
\t\t\t\t\t\t\t\t\tmin-width: 320px;
\t\t\t\t\t\t\t\t\tmax-width: 600px;
\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\tword-wrap: break-word;
\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\tbackground-color: #161a39;
\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\tborder-collapse: collapse;
\t\t\t\t\t\t\t\t\t\tdisplay: table;
\t\t\t\t\t\t\t\t\t\twidth: 100%;
\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\tbackground-color: transparent;
\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #161a39;"><![endif]-->

\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0;border-top: 0 solid transparent;border-left: 0 solid transparent;border-right: 0 solid transparent;border-bottom: 0 solid transparent;" valign="top"><![endif]-->
\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\tclass="u-col u-col-100"
\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\tmax-width: 320px;
\t\t\t\t\t\t\t\t\t\t\tmin-width: 600px;
\t\t\t\t\t\t\t\t\t\t\tdisplay: table-cell;
\t\t\t\t\t\t\t\t\t\t\tvertical-align: top;
\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\t\t\twidth: 100% !important;
\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t<!--[if (!mso)&(!IE)]><!--><div
\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\tbox-sizing: border-box;
\t\t\t\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-left: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-right: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-bottom: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t><!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t\t\t<table
\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\trole="presentation"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellpadding="0"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing="0"
\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"
\t\t\t\t\t\t\t\t\t\t\t\t\tborder="0"
\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 20px
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t10px
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t10px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign="left"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<table
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcellpadding="0"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing="0"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder="0"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding-right: 0;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding-left: 0;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign="center"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t></td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t\t\t\t</table>

\t\t\t\t\t\t\t\t\t\t\t\t<table
\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\trole="presentation"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellpadding="0"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing="0"
\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"
\t\t\t\t\t\t\t\t\t\t\t\t\tborder="0"
\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t10px
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t30px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign="left"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext-align: left;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext-align: center;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 28px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 39.2px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: #ffffff;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: Lato,
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>Nouveau
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\trendez-vous
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</span>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t\t\t\t</table>

\t\t\t\t\t\t\t\t\t\t\t\t<!--[if (!mso)&(!IE)]><!-->
\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t<!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]></td><![endif]-->
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>

\t\t\t\t\t\t<div
\t\t\t\t\t\t\tclass="u-row-container"
\t\t\t\t\t\t\tstyle="padding: 0; background-color: transparent"
\t\t\t\t\t\t>
\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\tclass="u-row"
\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\tmargin: 0 auto;
\t\t\t\t\t\t\t\t\tmin-width: 320px;
\t\t\t\t\t\t\t\t\tmax-width: 600px;
\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\tword-wrap: break-word;
\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\tbackground-color: #ffffff;
\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\tborder-collapse: collapse;
\t\t\t\t\t\t\t\t\t\tdisplay: table;
\t\t\t\t\t\t\t\t\t\twidth: 100%;
\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\tbackground-color: transparent;
\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0;border-top: 0 solid transparent;border-left: 0 solid transparent;border-right: 0 solid transparent;border-bottom: 0 solid transparent;" valign="top"><![endif]-->
\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\tclass="u-col u-col-100"
\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\tmax-width: 320px;
\t\t\t\t\t\t\t\t\t\t\tmin-width: 600px;
\t\t\t\t\t\t\t\t\t\t\tdisplay: table-cell;
\t\t\t\t\t\t\t\t\t\t\tvertical-align: top;
\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\t\t\twidth: 100% !important;
\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t<!--[if (!mso)&(!IE)]><!--><div
\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\tbox-sizing: border-box;
\t\t\t\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-left: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-right: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-bottom: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t><!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t\t\t<table
\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\trole="presentation"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellpadding="0"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing="0"
\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"
\t\t\t\t\t\t\t\t\t\t\t\t\tborder="0"
\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 40px
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t40px
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t30px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign="left"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext-align: left;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 18px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 25.2px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: #666666;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>Bonjour,
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t[prenom]</span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t&nbsp;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 18px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 25.2px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: #666666;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tUn
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\trendez-vous
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tà
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tété
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpris
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpar
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<b>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t[nom_client]
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</b>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tle<b>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t[date_rdv]
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</b>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tà
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<b>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t[heure_rdv]
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</b>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpour
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tle
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tservice
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<b>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t[nom_service]
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</b>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</span>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t&nbsp;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 18px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 25.2px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: #666666;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tVous
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpouvez
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tannuler
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tce
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\trendez-vous
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tà
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttout
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmoment
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdepuis
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvotre
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tespace
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tclient.
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</span>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t\t\t\t</table>

\t\t\t\t\t\t\t\t\t\t\t\t<table
\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\trole="presentation"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellpadding="0"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing="0"
\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"
\t\t\t\t\t\t\t\t\t\t\t\t\tborder="0"
\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t40px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign="left"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!--[if mso
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t]><style>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t.v-button {
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tbackground: transparent !important;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</style><!
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t[endif]-->
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t\t\t\t</table>

\t\t\t\t\t\t\t\t\t\t\t\t<table
\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\trole="presentation"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellpadding="0"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing="0"
\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"
\t\t\t\t\t\t\t\t\t\t\t\t\tborder="0"
\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 40px
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t40px
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t30px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign="left"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext-align: left;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: #888888;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 19.6px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t><em
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t><span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 16px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 22.4px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>Si
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tce
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tservice
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tne
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfait
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpas
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpartie
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdes
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tservices
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tque
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvous
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tproposez,
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tveuillez
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tnous
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tenvoyer
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tun
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmail
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tafin
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tque
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tl'on
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpuisse
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tannuler
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tce
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdit
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\trendez-vous.
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</span></em
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t></span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t><br /><span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: #888888;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 19.6px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t><em
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t><span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 16px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 22.4px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>&nbsp;</span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t></em
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t></span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t\t\t\t</table>

\t\t\t\t\t\t\t\t\t\t\t\t<!--[if (!mso)&(!IE)]><!-->
\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t<!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]></td><![endif]-->
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>

\t\t\t\t\t\t<div
\t\t\t\t\t\t\tclass="u-row-container"
\t\t\t\t\t\t\tstyle="padding: 0; background-color: transparent"
\t\t\t\t\t\t>
\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\tclass="u-row"
\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\tmargin: 0 auto;
\t\t\t\t\t\t\t\t\tmin-width: 320px;
\t\t\t\t\t\t\t\t\tmax-width: 600px;
\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\tword-wrap: break-word;
\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\tbackground-color: #18163a;
\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\tborder-collapse: collapse;
\t\t\t\t\t\t\t\t\t\tdisplay: table;
\t\t\t\t\t\t\t\t\t\twidth: 100%;
\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\tbackground-color: transparent;
\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #18163a;"><![endif]-->

\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 20px 20px 0;border-top: 0 solid transparent;border-left: 0 solid transparent;border-right: 0 solid transparent;border-bottom: 0 solid transparent;" valign="top"><![endif]-->
\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\tclass="u-col u-col-50"
\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\tmax-width: 320px;
\t\t\t\t\t\t\t\t\t\t\tmin-width: 300px;
\t\t\t\t\t\t\t\t\t\t\tdisplay: table-cell;
\t\t\t\t\t\t\t\t\t\t\tvertical-align: top;
\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\t\t\twidth: 100% !important;
\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t<!--[if (!mso)&(!IE)]><!--><div
\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\tbox-sizing: border-box;
\t\t\t\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 20px 20px 0;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-left: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-right: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-bottom: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t><!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t\t\t<table
\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\trole="presentation"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellpadding="0"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing="0"
\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"
\t\t\t\t\t\t\t\t\t\t\t\t\tborder="0"
\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 10px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign="left"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext-align: left;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<p
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t></p>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t\t\t\t</table>

\t\t\t\t\t\t\t\t\t\t\t\t<!--[if (!mso)&(!IE)]><!-->
\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t<!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]></td><![endif]-->
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 0 0 0 20px;border-top: 0 solid transparent;border-left: 0 solid transparent;border-right: 0 solid transparent;border-bottom: 0 solid transparent;" valign="top"><![endif]-->
\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\tclass="u-col u-col-50"
\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\tmax-width: 320px;
\t\t\t\t\t\t\t\t\t\t\tmin-width: 300px;
\t\t\t\t\t\t\t\t\t\t\tdisplay: table-cell;
\t\t\t\t\t\t\t\t\t\t\tvertical-align: top;
\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\t\t\twidth: 100% !important;
\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t<!--[if (!mso)&(!IE)]><!--><div
\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\tbox-sizing: border-box;
\t\t\t\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0 0 0 20px;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-left: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-right: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-bottom: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t><!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t\t\t<table
\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\trole="presentation"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellpadding="0"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing="0"
\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"
\t\t\t\t\t\t\t\t\t\t\t\t\tborder="0"
\t\t\t\t\t\t\t\t\t\t\t\t></table>

\t\t\t\t\t\t\t\t\t\t\t\t<!--[if (!mso)&(!IE)]><!-->
\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t<!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]></td><![endif]-->
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>

\t\t\t\t\t\t<div
\t\t\t\t\t\t\tclass="u-row-container"
\t\t\t\t\t\t\tstyle="padding: 0; background-color: #f9f9f9"
\t\t\t\t\t\t></div>

\t\t\t\t\t\t<div
\t\t\t\t\t\t\tclass="u-row-container"
\t\t\t\t\t\t\tstyle="padding: 0; background-color: transparent"
\t\t\t\t\t\t>
\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\tclass="u-row"
\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\tmargin: 0 auto;
\t\t\t\t\t\t\t\t\tmin-width: 320px;
\t\t\t\t\t\t\t\t\tmax-width: 600px;
\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\tword-wrap: break-word;
\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\tbackground-color: #f9f9f9;
\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\tborder-collapse: collapse;
\t\t\t\t\t\t\t\t\t\tdisplay: table;
\t\t\t\t\t\t\t\t\t\twidth: 100%;
\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\tbackground-color: transparent;
\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f9f9f9;"><![endif]-->

\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0;border-top: 0 solid transparent;border-left: 0 solid transparent;border-right: 0 solid transparent;border-bottom: 0 solid transparent;" valign="top"><![endif]-->
\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\tclass="u-col u-col-100"
\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\tmax-width: 320px;
\t\t\t\t\t\t\t\t\t\t\tmin-width: 600px;
\t\t\t\t\t\t\t\t\t\t\tdisplay: table-cell;
\t\t\t\t\t\t\t\t\t\t\tvertical-align: top;
\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\t\t\twidth: 100% !important;
\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t<!--[if (!mso)&(!IE)]><!--><div
\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\tbox-sizing: border-box;
\t\t\t\t\t\t\t\t\t\t\t\t\theight: 100%;
\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-left: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-right: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-bottom: 0 solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t><!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t\t\t<table
\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\trole="presentation"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellpadding="0"
\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing="0"
\t\t\t\t\t\t\t\t\t\t\t\t\twidth="100%"
\t\t\t\t\t\t\t\t\t\t\t\t\tborder="0"
\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t<tbody>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<td
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t40px
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t30px
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t20px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-family: 'Lato',
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsans-serif;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign="left"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 140%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext-align: left;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t></div>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t\t\t\t\t</tbody>
\t\t\t\t\t\t\t\t\t\t\t\t</table>

\t\t\t\t\t\t\t\t\t\t\t\t<!--[if (!mso)&(!IE)]><!-->
\t\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t\t\t<!--<![endif]-->
\t\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]></td><![endif]-->
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>

\t\t\t\t\t\t<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
\t\t\t\t\t</td>
\t\t\t\t</tr>
\t\t\t</tbody>
\t\t</table>
\t\t<!--[if mso]></div><![endif]-->
\t\t<!--[if IE]></div><![endif]-->
\t</body>
</html>
`

module.exports = { confirmationRDVProTemplate }