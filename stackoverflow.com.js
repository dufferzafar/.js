// ==UserScript==
// @name           Select Code Block Buttons
// @namespace      stackoverflow
// @include        *stackoverflow.com*
// ==/UserScript==

(function ()
{
    function with_jquery(f)
    {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.textContent = "(" + f.toString() + ")(jQuery)";
        document.body.appendChild(script);
    };

    with_jquery(function ($)
    {
        addButtons();

        function selectText(element)
        {
            var doc = document;
            if (doc.body.createTextRange)
            {
                var range = doc.body.createTextRange();
                range.moveToElementText(element);
                range.select();
            } else if (window.getSelection)
            {
                var selection = window.getSelection();
                var range = doc.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        function addButtons()
        {
            $("pre").each(function (i, codeBlock)
            {
                var qContainer = $("<div></div>");
                var id = "select-button-" + i;
                $(codeBlock).replaceWith(qContainer);
                qContainer.append(codeBlock);

                qContainer.mouseenter(function ()
                {
                    var qButton = $('<div style="position: absolute; opacity: 0; display: inline; cursor: pointer;' +
                                     'background-color: #000; color: #fff; font-size: 12pt; padding: 3px;">' +
                                     'Select</div>');
                    qButton.attr("id", id);
                    qContainer.append(qButton);
                    var left = $(codeBlock).offset().left + $(codeBlock).width() - qButton.width();
                    var top = $(codeBlock).offset().top;
                    qButton.css("left", left);
                    qButton.css("top", top);
                    qButton.click(function ()
                    {
                        selectText(codeBlock);
                    });
                    qButton.stop(true, true).animate({ opacity: '+=0.6' });
                });
                qContainer.mouseleave(function ()
                {
                    $("#" + id).stop(true, true).animate({ opacity: '-=0.6' }, function () { $("#" + id).remove(); });
                });
            });
        }
    });
})();
