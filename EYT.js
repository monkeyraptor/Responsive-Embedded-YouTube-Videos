var EYT = { // Functions Object.
    d: document,

    // Page scroll function.
    scroll: function (i, wrpr) {
        "use strict";
        var html = EYT.d.querySelectorAll("html")[0],
            b_ody = EYT.d.body,
            b_od = b_ody.getBoundingClientRect(),
            e_lm,
            top;

        if (!isNaN(i) && wrpr) {
            e_lm = wrpr[i].getBoundingClientRect();
            top = e_lm.top - b_od.top;
        } else {
            top = 0;
        }
        html.scrollTop = top;
        b_ody.scrollTop = top;
    },

    // Main functions here.
    init: function (container, object, dimensions, HF) {
        "use strict";
        var videos = object, // The video object input.
            ids = Object.keys(videos),
            aspect_ratio = dimensions.aspectRatio,
            header_content = HF.header || "<div class='header'>HULK</div>",
            footer_content = HF.footer || "<div class='footer'>FOOTEY</div>",

            // ========================================================
            // YouTube
            url_base = "https://youtu.be/", // Short YT URL base link.
            url_embed_base = "https://www.youtube.com/embed/", // YT embed URL base
            url_image_base = "https://i.ytimg.com/vi/", // YT image URL base (front)
            url_image_base_end = "/0.jpg", // YT image URL base (back)
            // ========================================================

            iframes,
            btn_on,
            btn_off,
            wrpr,
            array = [],
            yt_url,
            ctnr = EYT.d.getElementById(container), // Container element.
            timmy_outer,
            UA = navigator.userAgent,

            // ========================================
            // CONTENT (iframe, buttons, and textarea).
            half_0 = '<div class="yt_embed_wrap">' +
                        '<h3 class="yt_embed_title">',
            half_1 = '</h3>' +
                        '<iframe class="yt_embed" src=""></iframe>' +
                            '<div class="center_top">' +
                                '<div class="btn_container">' +
                                    '<button type="button" class="player_on">PLAY</button>' +
                                    '<button type="button" class="player_off" disabled="1">' +
                                    'CLEAR</button>' +
                                    '<textarea style="display:none; opacity:0" ' +
                                        'rows="1" readonly="readonly" ' +
                                        'wrap="off" title="YouTube URL" ' +
                                        'onclick="this.select()" class="yt_url"></textarea>' +
                                '</div>' +
                            '</div>' +
                        '</div>',
            // ========================================

            // Nodelist to Array (function).
            t_a = function (a) {
                if (EYT.d.querySelectorAll(a).length > 0) {
                    return Array.prototype.slice.call(EYT.d.querySelectorAll(a));
                }
            },

            // Video *PLAY* (function).
            player_on = function (v, i) {
                iframes[i].src = url_embed_base +
                                    videos[ids[i]] +
                                    "?wmode=transparent" +
                                    "&modestbranding=1" +
                                    "&rel=0" +
                                    "&showinfo=0" +
                                    "&fs=0" +
                                    "&autoplay=1";
                /* ======================================================== |
                |   To learn the embedded YT player PARAMETERS, go to:      |
                |       developers.google.com/youtube/player_parameters     |
                | ======================================================== */

                iframes[i].style.backgroundImage = "";
                iframes[i].style.opacity = 1;

                wrpr[i].style.background = "#000";
                wrpr[i].style.color = "#fff";

                v.disabled = 1;

                if (timmy_outer) {
                    window.clearTimeout(timmy_outer);
                }

                btn_on.forEach(function (v, ii) {
                    if (ii !== i) {
                        v.disabled = 1;
                    }
                });
            },

            // Video *CLEAR* (function).
            player_off = function (v, i, enable_btn_off) {
                var interval,
                    counter = 0,
                    limit,
                    check_btn = function () {
                        counter += 1;

                        limit = UA.match(/firefox/gi)
                            ? 25
                            : 6;

                        if (counter < limit) {
                            if (!v.disabled) {
                                v.disabled = 1;
                            }

                            // ========================================================
                            // These get buggy on Firefox, therefore I re-declare them.
                            // The removing *EventListener* part.
                            if (iframes.src) { // Making sure.
                                iframes[i].src = "";
                            }
                            // Making sure.
                            iframes[i].removeEventListener("load", enable_btn_off, 0);
                            iframes[i].removeEventListener("error", enable_btn_off, 0);
                            // ========================================================

                            if (!iframes[i].style.backgroundImage) {
                                iframes[i].style
                                    .backgroundImage = "url(" +
                                                        url_image_base +
                                                        videos[ids[i]] +
                                                        url_image_base_end +
                                                        ")";
                            }

                            if (yt_url[i].style.opacity === 1) {
                                yt_url[i].style.opacity = 0;
                            }

                            if (yt_url[i].style.display === "block") {
                                yt_url[i].style.display = "none";
                            }

                            if (!UA.match(/firefox/gi)) {
                                if (iframes[i].style.opacity === 1) {
                                    iframes[i].style.opacity = 0.5;
                                }
                                if (wrpr[i].style.background && wrpr[i].style.color) {
                                    wrpr[i].style.background = "";
                                    wrpr[i].style.color = "";
                                }
                            }
                        } else {
                            if (UA.match(/firefox/gi)) {
                                if (iframes[i].style.opacity === 1) {
                                    iframes[i].style.opacity = 0.5;
                                }

                                if (wrpr[i].style.background && wrpr[i].style.color) {
                                    wrpr[i].style.background = "";
                                    wrpr[i].style.color = "";
                                }

                                if (btn_on[i].disabled) {
                                    btn_on.forEach(function (v) {
                                        v.disabled = 0;
                                    });
                                }
                            }
                            if (btn_on[i].disabled) {
                                btn_on.forEach(function (v) {
                                    v.disabled = 0;
                                });
                            }
                            window.clearInterval(interval);
                        }
                    };

                iframes[i].src = "";
                iframes[i].removeEventListener("load", enable_btn_off, 0);
                iframes[i].removeEventListener("error", enable_btn_off, 0);
                iframes[i].style.opacity = 0.5;

                // Forcing button thing.
                interval = window.setInterval(check_btn, 100);
            },

            // Button click handler (function).
            clck = function (v, i) {
                var enable_btn_off = function () {
                    yt_url[i].style.display = "block";

                    timmy_outer = window.setTimeout(function () {
                        yt_url[i].style.opacity = 1;
                    }, 500);

                    btn_off[i].disabled = 0;
                };

                EYT.scroll(i, wrpr); // Page scroll.

                if (v.className === "player_on") { // *PLAY*.
                    iframes[i].addEventListener("load", enable_btn_off, 0);
                    iframes[i].addEventListener("error", enable_btn_off, 0);

                    player_on(v, i); // Go to *player_on* function.
                } else { // *CLEAR*.
                    player_off(v, i, enable_btn_off); // Go to *player_off* function.
                }
            },

            // Responsive iframes (function).
            rv = {
                w: window,
                css: function (a) {
                    return rv.w.getComputedStyle(a, null);
                },
                re_size: function (a) {
                    var all_properties,
                        height,
                        width,
                        default_height = dimensions.height + "px",
                        default_width = dimensions.width + "px",
                        window_width = rv.w.innerWidth,
                        add_30px = a.src
                            ? 30
                            : 0;

                    if (window_width < dimensions.width) {
                        a.forEach(function (v) {
                            v.style.width = "100%";
                        });

                        all_properties = rv.css(a[0]);
                        width = parseInt(all_properties.getPropertyValue("width"), 10);

                        height = Math.floor(width * (aspect_ratio)) + add_30px;
                        // The extra 30px is for the player control,
                        // only when the iframe has non-empty source attribute.

                        a.forEach(function (v) {
                            v.style.height = height + "px";
                        });
                    } else {
                        a.forEach(function (v) {
                            v.style.cssText += "height:" + default_height +
                                                ";width:" + default_width;
                        });
                    }
                }
            };

        /*|============= |*|
        |*|  INJECTION.  |*|
        |*| ============ |*/
        // [1] Header content definition.
        array.push(header_content);

        // [2] Body content (titles, iframes, buttons, and URL links) definition.
        ids.forEach(function (v) {
            array.push(half_0 + v + half_1);
        });

        // [3] Footer content definition.
        array.push(footer_content);

        // [4] Inject Header-Body-Footer into the container element.
        ctnr.innerHTML = array.join("");

        // [5] Define iframes, buttons, wrappers, and YT url containers.
        iframes = t_a(".yt_embed");
        btn_on = t_a(".player_on");
        btn_off = t_a(".player_off");
        wrpr = t_a(".yt_embed_wrap");
        yt_url = t_a(".yt_url");

        // [6] Loop using *iframes* reference.
        // The length of all 5 variables defined above are the same.
        iframes.forEach(function (v, i) {
            btn_on[i].onclick = function () { // Button *PLAY* click handler.
                clck(btn_on[i], i);
            };

            btn_off[i].onclick = function () { // Button *CLEAR* click handler.
                clck(btn_off[i], i);
            };

            // Set initial *background-image* on iframes.
            v.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + videos[ids[i]] + '/0.jpg)';

            // Set value to YouTube URL textareas.
            yt_url[i].value = url_base + videos[ids[i]];
        });

        // ==============================================
        // RESPONSIVE IFRAMES MODULE INVOCATION (*rv* variable).
        rv.re_size(iframes);
        rv.w.addEventListener("resize", function () {
            rv.re_size(iframes);
        });
    }
};

/*|=========================|**
**| INITIALIZE THE FUNCTION |**
**|=========================|*/
// #[I] Initialize the main function.
EYT.init(
    // ======================= //
    // List of input arguments //
    // ======================= //

     /*| #[I.1] The container element's ID |*/
    "yt_embed_container",

    /*| #[I.2] Object                   |**
    **|    {"title": "video ID"} pairs. |**
    **|    Put as many as you want.     |*/
    {
        "Expressions": "arJtsvv6akc",
        "Dancing Zoidberg along with Minuet (Luigi Boccherini)": "ikl3hGEfSLc",
        "Knock Knock Joke": "rLwDNwkJqjY",
        "Babba's tribute to mainstream music": "8DTgMZP6f8U"
    },

    /*| #[I.3] Default dimensions and aspect ratio |*/
    {
        /*| #[I.3.a] Dimensions in pixels |*/
        "height": 360,
        "width": 640,

        /*| #[I.3.b] Aspect ratio |*/
        "aspectRatio": 9/16

        // It can be 3/4, or 1/2, up to you.
        // The largest number is the width ratio.
        // Put the smallest value in front: *small_number/big_number*.

        // This feature will work on screen which has narrower width than you define above.
    },

    /*| #[1.4] HEADER and FOOTER CONTENT |*/
    // Customize the HEADER and FOOTER CSS from the [style] tag above.
    // Header class: .header
    // Footer class: .footer
    {
        "header": "<div class='header'>" +
                "Multiple YouTube Embedded Videos<br>" +
                "<small>Without YouTube JS API</small><br>" +
                "<small>" +
                "<em>For <u>mobile player</u> (flv), the " +
                "<mark>autoplay</mark> parameter (currently) doesn't work</em>" +
                "</small>" +
                "</div>",

        "footer": "<div class='footer'>" +
                "<div>Template by Monkey Raptor</div>" +
                "<div><small>See <em>page source</em> | See source on <a target='_blank' title='new window' href='https://github.com/monkeyraptor/Responsive-Embedded-YouTube-Videos'>GitHub</a></small></div>" +
                "<div><small>Updated May 28, 2015</small></div>" +
                "<div><button type='button' class='scroller' onclick='EYT.scroll()'>" +
                "TOP</button></div>" +
                "</div>"
    }
);

// #[II] Initialize scrolling to the top of the page.
/*| ============================================== |*|
|*|   Scroll to the top of the page on DOM load.   |*|
|*| ============================================== |*/
EYT.scroll();


// These lines below can be omitted (demo purpose only).
/*| ========================== |*|
|*|   EXTRA FUNC:              |*|
|*|     - Check if in iframe.  |*|
|*| ========================== |*/
var extra = {
        in_iframe: function () { // stackoverflow.com/a/326076
            "use strict";
            try {
                return window.self !== window.top;
            } catch (e) {
                if (e) {
                    return 1;
                }
            }
        },
        rmv_node: function (a, b) {
            "use strict";
            a.removeChild(b);
        }
    },
    footer = document.querySelectorAll(".footer")[0],
    h3_elm = footer.childNodes[0],
    vsource_elm = footer.childNodes[1];

if (extra.in_iframe()) {
    extra.rmv_node(footer, h3_elm);
    extra.rmv_node(footer, vsource_elm);
}
