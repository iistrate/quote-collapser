/* Author:
   Ioan G. Istrate https://github.com/iistrate
*/

(function($) {
    'use strict';

    $.fn.maxLenQuote = function(options) {

        var wrapper = this,
            //default values
            defaults = {
                max: 15,
                strip: true
            },
            //opts are either default or what we pass via options
            opts = $.extend({}, opts, options),

            //regular expressions used in our program
            reText = /[\"|\'](\s*\S*)*[\"\']/gi,
            reStrip = /\n*\t*/g,
            reDigit = /\d+/;

        var checkOptions = (function () {
            //check if a digit is passed; else use defaults
            //just making sure noone enters bs into the option field
            if (!reDigit.test(options.max) || options.max < 0) {
                opts.max = defaults.max;
                console.log('%cHey guy, you are supposed to enter positive integers for the max value, ' +
                    'but no worries we got you covered with defaults.','color:red');
            }
        }());


        var grabContent = function(items) {
            $.each(items, function() {
                //cache this
                var $this = $(this),
                    //grab our a element
                    children = $this.children(),
                    //grab the text via javascript dom
                    textContent = ($this[0].firstChild.textContent
                                            //striping the new lines or tabs
                                            .replace(reStrip, ''))
                                            //then grab only what's inside the quote
                                            .match(reText)[0];
                    //split into words
                    textContent = textContent.split(' ');
                    //truncated holds the words up until max
                    var truncated = textContent.splice(0, opts.max),
                        //ending holds the remainder
                        ending = textContent.splice(0);
                        
                //re build the list item
                $this.html(
                    //grab the words up until max
                    truncated.join(' ') +
                    //wrap the ... in a span for ease of removal
                    String(ending.length > 0 ? ' <span>...</span> ' : '') +
                    ' -- '
                ).append(children); //add the child elements back

                //if ending add the button, we'll store the ending data in it
                if (ending.length > 0) {
                    $this.append('<br /><a href="#" data-toggled="false" data-content="' + ending.join(' ') + '">Read More</a>');
                }
            });


                //if ending add the button, we'll store the ending data in it
                if (ending.length > 0) {
                    $this.append('<br /><a href="#" data-toggled="false" data-content="' + ending.join(' ') + '">Read More</a>');
                }
            });
        };

        var setupEvents = function() {
            //set up a click event on [data-content]
            wrapper.find('[data-content]').on('click', function(e) {
                var $this = $(this),
                    toggled = ($this.attr('data-toggled') !== 'true');

                $this.text('Read ' + (toggled ? 'Less' : 'More'));
                $this.attr('data-toggled', String(toggled));
                //get parent, find span if toggled add data-content else add ...
                $this.parent().find('span').text(toggled ? $this.attr('data-content') : ' ... ');

                e.preventDefault();
            });
        };

        var init = (function() {
            grabContent(wrapper.find('li'));
            setupEvents();
        }());

        return this;
    };

    $(document).on('ready', function() {

      $('.quotes').maxLenQuote({max: 15})
          //this is just to show that with our built we still
          // have access to the . notation after it ran
          .css({
            borderBottom: '1px dashed lightGray'
          });
    });

}(jQuery));
