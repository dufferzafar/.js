// Remove the Github logo on top-right corner
$('a[class^=header-logo-]').remove();

// Hide the clone urls.
$('div[data-protocol-type^=subversion]').remove();
$('p.clone-options').remove();
$('div.clone-url').remove();

// Remove the Clone on Windows button.
$('a.minibutton.sidebar-button:first').remove();

// Show full sidebar on all pages.
// $('div.repository-with-sidebar').addClass('with-full-navigation');

/**
 * Display Github Avatars
 *
 * Original Source: https://github.com/anasnakawa/chrome-github-avatars
 */
var $news = $('.news')

// hacking into jQuery ajax to be notified
// once the pagination ajax completed

, onPaginationComplete = function () {
  getAvatarsForUsers(function (data) {
    printImages(data.items);
  });
}

// generate search url for a
// list of github usernames
// ------------------------

, generateUrl = function (array, pagination) {
  for (var i in array) {
    array[i] = 'user%3A' + array[i];
  }
  return '//api.github.com/search/users?q=' + array.join('+') + (pagination ? '&per_page=' + pagination : '');
}

// drop duplicated items from an array
// -----------------------------------

, unique = function (array) {
  var temp = {};
  for (var i in array) {
    temp[array[i]] = {};
  }
  return Object.keys(temp);
}

// get new users
// -------------

, prepareNewUsersOnPage = function () {
  var users = $news.find('.alert').not('.push, .public, .issues_comment, .avatar-ready').find('.title a:eq(0)').map(function () {
    var $self = $(this)
      , username = $self.text();

    $self.addClass(username);

    $self.parent().addClass('avatar-container')

    // store username
    $self.closest('.alert')
      .attr('data-username', username);

    return username;
  }).toArray();

  return unique(users);
}

// print all users gravatars into DOM
// ----------------------------------

, printImages = function (items) {
  for (var item in items) {
    var $img = $('<img />').addClass('github-avatar').attr('src', items[item].avatar_url);
    $img.css({
        position: 'absolute',
        left: 0,
        top: '6px',
        borderRadius: '4px',
        width: '32px',
        height: '32px'
    });

    $('.alert:not(.avatar-ready,.issues_opened) .' + items[item].login).each(function () {
      var $self = $(this);

      $img.clone().insertBefore($self);
      $self.closest('.alert').addClass('avatar-ready');
    });
  }
}


, getAvatarsForUsers = function (callback) {
  $.get(generateUrl(prepareNewUsersOnPage(), 31), callback);
}

// tricking first element in feed
// ------------------------------

, $first = $('.news .alert').eq(0), $clone;

$first.clone().insertBefore($first);
$clone = $first.prev();
$first.css('border', 'none');
$clone.css({
  height: 0
  , padding: 0
});


// query github API
// ----------------
getAvatarsForUsers(function (data) {
  printImages(data.items);
});

// hacking into pagination calls
// -----------------------------
// since we don't have access to github's
// jQuery object, we'll do a workaround here
$news.on('click', '.js-events-pagination', function () {

  console.info('waiting for a pagination to complete');

  var $button = $(this)
    , $container = $button.parent()


  , id = setInterval(function () {

    if (!$container.hasClass('loading')) {
      clearInterval(id);
      onPaginationComplete();
      console.info('pagination completed');
    } else {
      console.info('waiting...');
    }

  }, 500);
});


/**
 * Github Contributions Heatmap
 *
 * Original Source: https://greasyfork.org/en/scripts/4941-github-contributions-heatmap
 */
var GithubHeatmap = {

  COLDEST_HUE: 240,
  HOTTEST_HUE: 0,
  MAX_CONTRIBUTION_COUNT: 20,

  getCssColor: function(hue, saturation, luminosity) {
    return "hsl(" + hue + ", " + saturation + "%, " + luminosity + "%)";
  },

  adjustFunction: function(x) {
    return Math.pow((x - 1), 3) + 1;
  },

  adjustValue: function(x, max) {

    if (x < 0 || max === 0) {
      return;
    }

    //On repasse la valeur sur [0, 1] avant d'appliquer la fonction
    var value = x / max;

    return Math.floor(GithubHeatmap.adjustFunction(value) * max);
  },

  getFillColor: function(contributionCount) {

    if (contributionCount === 0) {
      return null;
    }

    contributionCount = Math.min(contributionCount, GithubHeatmap.MAX_CONTRIBUTION_COUNT);

    var hue = Math.floor(((GithubHeatmap.adjustValue(contributionCount, GithubHeatmap.MAX_CONTRIBUTION_COUNT) /
        (GithubHeatmap.adjustValue(GithubHeatmap.MAX_CONTRIBUTION_COUNT, GithubHeatmap.MAX_CONTRIBUTION_COUNT))) *
      (GithubHeatmap.HOTTEST_HUE - GithubHeatmap.COLDEST_HUE)) + GithubHeatmap.COLDEST_HUE);

    return GithubHeatmap.getCssColor(hue, 70, 50);
  },

  addHeatmap: function() {

    var $calendar = $("#contributions-calendar");

    var $calDays = $(".js-calendar-graph-svg .day");

    if ($calDays.length > 0 && $calendar.attr("data-heatmap") !== "heatmap") {

      $calendar.attr("data-heatmap", "heatmap");

      $calDays.each(function() {

        var contributionCount = parseInt(this.getAttribute("data-count"));

        if (contributionCount > 0) {
          this.setAttribute("data-fill", this.style.fill);
          this.style.fill = GithubHeatmap.getFillColor(contributionCount);
        }
      });

      var contributionCount = 1;

      $(".contrib-legend li").each(function() {

        this.setAttribute("data-fill", $(this).css("background-color"));
        $(this).css("background-color", GithubHeatmap.getFillColor(contributionCount));
        contributionCount += 15;
      });
    }
  },

  init: function() {

    GithubHeatmap.addHeatmap();

    var target = document.querySelector(".site");

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        GithubHeatmap.addHeatmap();
      });
    });

    observer.observe(target, {
      subtree: true,
      childList: true
    });
  }

};

GithubHeatmap.init();
