// Remove the Github logo on top-right corner
$('a[class^=header-logo-]').remove();

// Hide the clone urls.
$('div[data-protocol-type^=subversion]').remove();
$('p.clone-options').remove();
$('div.clone-url').remove();

// Remove the Clone on Windows button.
$('a.minibutton.sidebar-button:first').remove();

// Show full sidebar on all pages.
$('div.repository-with-sidebar').addClass('with-full-navigation');
