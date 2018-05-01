(function () {
  var startTag = '<h2';
  
  function print(html, selector) {
    if(!selector) {
      selector = '#root'; 
    }
    document.querySelector(selector).innerHTML += html;
  }

  function createIdFromString(string) {
    if(string) {
      return string.trim().toLowerCase().replace(/\s/g, '-') || '';  
    }
    return '';
  }

  function addMenuItems(sections) {
    var htmlString = '<div>' + startTag + sections[1] + '</div>';
    var dom = $(htmlString);
    var titles = [];
    
    var item = '<ul>';
    item += '' +
    '<li><a class="active" href="#home">' + 
      ($(window).width() > 768 ? 'Freshpack' : 'Home') +
    '</a></li>';

    dom.find('a strong').each(function(index) {
      var title = $(this).text();
      titles.push(title);
      var id = createIdFromString(title);
      item += '<li><a href="#' + id + '">' + title + '</a></li>';
    });

    item += '<li><a href="https://github.com/freshpack/freshpack">Code</a></li>';
    item += '</ul>';
    
    print(item, 'header nav');

    return {
      sections: sections,
      titles: titles
    }
  }

  function addHamburger() {
    var hamburger = '';
    hamburger += '<button class="hamburger hamburger--collapse" type="button">';
    hamburger += '<span class="hamburger-box">';
    hamburger += '<span class="hamburger-inner"></span>';
    hamburger += '</span>';
    hamburger += '</button>';
    print(hamburger, 'header nav');
  }

  function addSections(data) {
    data.sections.forEach(function(section, index){
      if(index > 1) {
        var id = createIdFromString(data.titles[index - 2]);
        print('<section id="' + id + '"><article>' + startTag + section + '</article></section>', '.content');
      } else if(index === 0){
        section = section.replace(
          'Command line tool for a quick development start of React apps.',
          '<span class="span-1">Command line tool</span> <br/>' +
          '<span class="span-2">for a quick development start of </span> <br/>' +
          '<span class="span-3">React apps</span>. <br/>'
        );
        section = section.replace(
          'boilerplates and installs',
          'boilerplates and <br/>installs'
        );
        section = section.replace('*', '');
        
        print('<section id="home"><article>' + section + '</article></section>', '.content')
      }
    });
  }

  fetch('https://raw.githubusercontent.com/freshpack/freshpack/master/README.md')
    .then(function(response) {
      return response.text()
    })
    .then(function(markdownString) {
      addHamburger();
      var converter = new showdown.Converter();
      var htmlString = converter.makeHtml(markdownString).replace(/--&gt;/g, '-->');
      htmlString = htmlString.replace(/--&gt;/g, '-->');
      var sections = htmlString.split(startTag);
      return addMenuItems(sections);
    })
    .then(function(data) {
      return addSections(data);
    })
    .then(function() {
      updateStartHeight();

      $( 'header h3' ).letterdropFx();

      $('#home').css({
        "min-height": $(window).height(),
        "background-image": 'url(assets/img/bg-1.jpg)',
        "background-size": 'cover'
      });

      $(window).on("resize", updateStartHeight);
      $(document).on("scroll", onScroll);

      $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");

        $('a').each(function () {
          $(this).removeClass('active');
        })
        $(this).addClass('active');

        var target = this.hash;
        $target = $(target);
        $('html, body').stop().animate({
          'scrollTop': $target.offset().top+2
        }, 500, 'swing', function () {
          window.location.hash = target;
          $(document).on("scroll", onScroll);
        });
      });

      $(".hamburger").on("click", function(e) {
        $(this).toggleClass("is-active");
        if($(this).hasClass("is-active")) {
          $('nav ul').css('display', 'block');
        } else {
          $('nav ul').css('display', 'none');
        }
      });

      $("nav ul li a").on("click", function(e) {
        if($(window).width() <= 768) {
          $(".hamburger").click();
        }
      });
    });

  function updateStartHeight(){
    $('#home').css({
      "min-height": $(window).height()
    });
    
    if($(".hamburger").hasClass("is-active")) {
      if($(window).width() <= 768) {
        $(".hamburger").click();
      }
    }
    
    if($(window).width() > 768) {
      $('nav ul').css('display', 'block');
    } else {
      $('nav ul').css('display', 'none');
    }
  }

  function onScroll(e){
    var scrollPosition = $(document).scrollTop();
    var links = $('nav a');
    links.each(function () {
      var currentLink = $(this);
      if(currentLink[0] === links.last()[0]) {
        return;
      }
      var refElement = $(currentLink.attr("href"));
      if (refElement.position().top <= scrollPosition && refElement.position().top + refElement.height() > scrollPosition) {
        $('nav ul li a').removeClass("active");
        currentLink.addClass("active");
      }
      else{
        currentLink.removeClass("active");
      }
    });
  }

}());