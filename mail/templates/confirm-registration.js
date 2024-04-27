const confirmRegistrationTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
\txmlns="http://www.w3.org/1999/xhtml"
\txmlns:v="urn:schemas-microsoft-com:vml"
\txmlns:o="urn:schemas-microsoft-com:office:office"
>
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
\t\t\t\t\tpadding-left: 0px !important;
\t\t\t\t\tpadding-right: 0px !important;
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
\t\t\t\t\t\t\tstyle="padding: 0px; background-color: #f9f9f9"
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
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #f9f9f9;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f9f9f9;"><![endif]-->

\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
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
\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0px;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-left: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-right: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-bottom: 0px solid
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
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\theight="0px"
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
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 0px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 0px;
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
\t\t\t\t\t\t\tstyle="padding: 0px; background-color: transparent"
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
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #161a39;"><![endif]-->

\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
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
\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0px;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-left: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-right: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-bottom: 0px solid
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
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding-right: 0px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding-left: 0px;
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
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0px
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
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>Confirmer
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvotre
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tinscription
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
\t\t\t\t\t\t\tstyle="padding: 0px; background-color: transparent"
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
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
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
\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0px;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-left: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-right: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-bottom: 0px solid
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
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>Nous
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvous
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tenvoyons
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tce
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmail
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsuite
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tà
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvotre
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tinscription
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsur
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPlanifi.</span
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
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPour
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tactiver
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvotre
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcompte,
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tveuillez
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcliquer
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsur
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tle
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tbouton
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tci
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdessous.
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tCe
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlien
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsera
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvalide
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpendant
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t1
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\theure.
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
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0px
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
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\talign="left"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:51px; v-text-anchor:middle; width:205px;" arcsize="2%"  stroke="f" fillcolor="#18163a"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\thref="[lien_inscription]"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttarget="_blank"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="v-button"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tbox-sizing: border-box;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdisplay: inline-block;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext-decoration: none;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t-webkit-text-size-adjust: none;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\ttext-align: center;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor: #ffffff;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tbackground-color: #18163a;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tborder-radius: 1px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t-webkit-border-radius: 1px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t-moz-border-radius: 1px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\twidth: auto;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmax-width: 100%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toverflow-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-break: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tword-wrap: break-word;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmso-border-alt: none;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 14px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdisplay: block;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 15px
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t40px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 120%;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t><span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tstyle="
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfont-size: 18px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tline-height: 21.6px;
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tActiver
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvotre
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcompte</span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t></span
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</a>
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!--[if mso]></center></v:roundrect><![endif]-->
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
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t>Veuillez
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tignorer
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcet
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\temail
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsi
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvous
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tn'avez
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpas
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tfait
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tde
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdemande
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\td'inscription
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsur
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tle
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsite.
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
\t\t\t\t\t\t\tstyle="padding: 0px; background-color: transparent"
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
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #18163a;"><![endif]-->

\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 20px 20px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
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
\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 20px 20px 0px;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-left: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-right: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-bottom: 0px solid
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
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><td align="center" width="300" style="width: 300px;padding: 0px 0px 0px 20px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
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
\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0px 0px 0px 20px;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-left: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-right: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-bottom: 0px solid
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
\t\t\t\t\t\t\tstyle="padding: 0px; background-color: #f9f9f9"
\t\t\t\t\t\t></div>

\t\t\t\t\t\t<div
\t\t\t\t\t\t\tclass="u-row-container"
\t\t\t\t\t\t\tstyle="padding: 0px; background-color: transparent"
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
\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f9f9f9;"><![endif]-->

\t\t\t\t\t\t\t\t\t<!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
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
\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0px;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-top: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-left: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-right: 0px solid
\t\t\t\t\t\t\t\t\t\t\t\t\t\ttransparent;
\t\t\t\t\t\t\t\t\t\t\t\t\tborder-bottom: 0px solid
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
\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tpadding: 0px
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

module.exports = { confirmRegistrationTemplate }