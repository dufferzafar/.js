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

        if(x < 0 || max === 0) {
            return;
        }

        //On repasse la valeur sur [0, 1] avant d'appliquer la fonction
        var value = x / max;

        return Math.floor(GithubHeatmap.adjustFunction(value) * max);
    },

    getFillColor: function(contributionCount) {

        if(contributionCount === 0) {
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

        if($calDays.length > 0 && $calendar.attr("data-heatmap") !== "heatmap") {

            $calendar.attr("data-heatmap", "heatmap");

            $calDays.each(function() {

                var contributionCount = parseInt(this.getAttribute("data-count"));

                if(contributionCount > 0) {
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

        observer.observe(target, { subtree: true, childList: true });
    }

};

GithubHeatmap.init();
