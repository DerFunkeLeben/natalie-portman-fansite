$(document).ready(function(){
	swiperConfig();
	var gallery;
	deleteTopBorderOfTable();
	$('.popup-container').hide();
	Scrolls();
	openGallery();
	findOutMaxHeightOfTabbleCell();

	$('.hidden-menu-link').click(function(){
		$('.menu-mobile-btn').click();
	});

	$('.about-container__accordion').click(function(){
		$("#about-container__hidden-panel").slideToggle("slow", "swing");
		$( ".about-container__text__read-more" ).toggle();	
		if(resizeWindow()==1) {
			AnimatedScroll($(".about-container__photo")[0], 500)
		}	
	});

	$('.open-news-item__full').click(function(){
		let this_ = $(this).parent().parent();
		this_.toggleClass("news-item_active");
		let speed;

		if(document.getElementsByClassName('news-item_hidden').length){
			$(".news-item__full").fadeOut(200);
			$('.news-item_hidden').fadeIn(1000);
			$(".news-item__description-briefly").show();
			$(".news-item").toggleClass("news-item_hidden");
			this_.toggleClass("news-item_hidden");	
			$(".news-item__read-more").text("Подробнее \u21C0");
		}
		else {
			$(".news-item").toggleClass("news-item_hidden");
			this_.toggleClass("news-item_hidden");
			$(".news-item_active .news-item__description-briefly").hide();
			if(resizeWindow()==1)  speed= 1;
			else speed = 1000;
			
			$('.news-item_hidden').fadeOut(speed);
			$('.news-item_active .news-item__full').fadeIn(1000);
			AnimatedScroll($(".news-item_active .news-item__full")[0], 500);
			$(".news-item_active .news-item__read-more").text("К другим новостям \u21C0");
		}
	});

	$('.filmography__read-more').click(function(){
		$('.filmography__read-more').hide();
		$('.filmography__table').hide();
		AnimatedScroll('#filmography-container');
		deleteTopBorderOfTable();
		let rowsCount = $(".filmography__table tr").length;
		const columnsOfTablesInFilmography = resizeWindow();
		let tables = sliceTable(document.getElementsByClassName('filmography__table')[0], Math.ceil(rowsCount/columnsOfTablesInFilmography))
		tables.forEach(element => {	element.classList.add("filmography__table")});

		$(".filmography").addClass("filmography_full");
		$(".filmography-container").addClass("filmography-container_full");
		$(".filmography__tables").append(tables);
		$(".film-item_hidden").addClass("film-item_visible");
		$(".film-item_hidden").removeClass("film-item_hidden");
		findOutMaxHeightOfTabbleCell();
		deleteTopBorderOfTable();
	});

	$('.popup__fullscreen-btn').click(function(){
		if(this.classList.contains('inFullScreen'))
			toggleFullscreen(true);
		else 
			toggleFullscreen(false);
	});
	
	$('.popup-container').click(function(event){
		if(event.target == this) {
			HidePopUp();
		}
	});

	$('.popup__close-btn').click(function(){
		HidePopUp();
	});

	$('.popup__download-btn').click(function(){
		var link = document.createElement("a");
		var imgPath = $('.photo-swiper .swiper-slide-active .photo-slide__image').attr('src');
		console.log('../' + imgPath);
   		link.setAttribute("href", imgPath);
		console.log(link);
    	link.setAttribute("download", "w3");
		link.click();
	});

	function HidePopUp() {
		$('.popup-container').fadeOut(500);
		$('.popup-container > .popup').hide();
		$('body').children().toggle();

		if ($('.popup__fullscreen-btn')[0].classList.contains('inFullScreen'))
			toggleFullscreen(true);

		AnimatedScroll('#photosessions-container', 1);
	};

	function ShowPopUp(popup_type) {
		$('body').children().toggle();
		$('.popup-container').fadeIn(500);
		$(popup_type).fadeIn(500);
		if(window.matchMedia('(max-height: 540px)').matches){
			$('.popup-container').css('overflow', 'scroll');
		}
	};

	function AnimatedScroll(_id, speed = 1000) {
		let offset_ = 0;
		if($(".menu-mobile").css('display')!=="none")
			offset_ = -50;
		var top = $(_id).offset().top + offset_;
		$('html, body').animate({scrollTop: top }, speed);
		return false;
	};

	function swiperConfig(){
		var swiper = new Swiper('.album-swiper', {
			effect: 'coverflow',
			grabCursor: true,
			centeredSlides: true,
			slidesPerView: 'auto',
			spaceBetween: 10,
			mousewheel: true,
			coverflowEffect: {
			rotate: 0,
			stretch: 0,
			depth: 300,
			modifier: 1,
			slideShadows: true,
			},
			breakpoints: {
				640: {
					spaceBetween: 20,
				},
				768: {
					spaceBetween: 40,
				},
				1024: {
					spaceBetween: 60,
				},
			}
		});
	};

	function galleryConfig(gallery){
		gallery = new Swiper('.photo-swiper', {
			observer: true,
            observeParents: true,
			observeSlideChildren: true,
			slidesPerView: 1,
			spaceBetween: 30,
			navigation: {
				nextEl: '.photo-swiper-button-next',
				prevEl: '.photo-swiper-button-prev',
			},
			lazy: true,
			pagination: {
				el: '.photo-swiper-pagination',
				type: 'fraction',
			},
		});
		return gallery;
	};

	function appendSlide_ (gallery, folder, file) {
		gallery.appendSlide('<div class="swiper-slide photo-slide"><img data-src="img/' + folder + '/' + file +'"' + 'class="swiper-lazy photo-slide__image"> <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div></div>');
	}

	function deleteTopBorderOfTable(table = 'filmography__table', tableRow = "film-item_visible") {
		let tables = document.getElementsByClassName(table);
		for(let i = 0; i < tables.length; i++)
		{
			let elements = tables[i].getElementsByClassName(tableRow);
			if(elements.length) {
				first = elements[0];
				first.classList.toggle("first-visible-item");
			}
		};
	};

	function findOutMaxHeightOfTabbleCell (tableCell = "film-item_visible") {
		let maxheight = 0;
		let cells = document.getElementsByClassName(tableCell);
		
		for(let i = 0; i < cells.length; i++)
		{
			let height = cells[i].scrollHeight;
			(maxheight < height) ? maxheight = height : maxheight = maxheight;
		};
		$("." + tableCell).css('height', (maxheight+1)+'px');
	};

	function sliceTable(largeTable, chunk) {
		let lesserTables = [];
		largeTable = lesserTables.slice.call(largeTable.children[0].children);
		for (let t = 0, len = largeTable.length, table; t < len; t += chunk) {
		table = document.createElement('table');
		largeTable
			.slice(t, t+chunk)
			.map(tr => table.appendChild(tr));
		lesserTables.push(table);
		}
		return lesserTables;
	};

	function openAlbum (album, folder, photos)
	{
		if(gallery)
			gallery.removeAllSlides();
		
		$('.popup .popup__title').text(album);

		gallery = galleryConfig();
		photos.forEach(element => appendSlide_ (gallery, folder, element));
		gallery.activeIndex = 0; 

		gallery.on('slideChange', function () {
			gallery.navigation.update();
		});

		ShowPopUp('.popup');
	};

	function Scrolls () {
		
		$('.about-link').click(function(){
			AnimatedScroll('#about-container');
		});
	
		$('.news-link').click(function(){
			AnimatedScroll('#news-container');
		});
	
		$('.photo-link').click(function(){
			AnimatedScroll('#photosessions-container');
		});
	
		$('.films-link').click(function(){
			AnimatedScroll('#filmography-container');
		});
	};

	function openGallery() {
		$('.open-album-2018').click(function(){
			openAlbum(	'2018', 
						'2018', 
						['18_1.jpg', '18_2.jpg', '18_3.jpg', '18_4.jpg', '18_5.jpg']);		
		});

		$('.open-album-2017').click(function(){
			openAlbum(	'2017', 
						'2017', 
						['17_1.jpg', '17_2.jpg', '17_3.jpg']);		
		});
	
		$('.open-album-2016').click(function(){
			openAlbum(	'2016', 
						'2016', 
						['16_1.jpg', '16_2.jpg', '16_3.jpg', '16_4.jpg', '16_5.jpg', '16_6.jpg', '16_7.jpg']);		
		});

		$('.open-album-2015').click(function(){
			openAlbum(	'2015', 
						'2015', 
						['15_1.jpg', '15_2.jpg', '15_3.jpg', '15_4.jpg', '15_5.jpg', '15_6.jpg', '15_7.jpg', '15_8.jpg']);		
		});

		$('.open-album-2014').click(function(){
			openAlbum(	'2014', 
						'2014', 
						['14_1.jpg', '14_2.jpg', '14_3.jpg', '14_4.jpg']);		
		});
	};

	function toggleFullscreen(inFullscreen) {
		if (!inFullscreen) {
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
				document.documentElement.webkitRequestFullscreen();
			} else if (document.documentElement.msRequestFullscreen) { /* IE11 */
				document.documentElement.msRequestFullscreen();
			};
		}
		else {
			if (document.exitFullscreen) {
				document.exitFullscreen(); 
			} else if (document.webkitExitFullscreen) { /* Safari */
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) { /* IE11 */
				document.msExitFullscreen();
			};
		}
		$(".popup__fullscreen-btn .popup-btn__icon").toggleClass('fa-expand');
		$(".popup__fullscreen-btn .popup-btn__icon").toggleClass('fa-compress');
		$('.popup__fullscreen-btn').toggleClass('inFullScreen');
	};

	function resizeWindow() {
		if (window.matchMedia("(min-width: 768px) and (max-width: 1371px)").matches)  // If media query matches
			return 2;
		else if (window.matchMedia("(min-width: 1341px)").matches)
			return 3;
		else return 1;
	};
});