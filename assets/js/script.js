const nav = document.querySelector('nav');
const aboutSection = document.querySelector('.about');

function updateNavStyle() {
	if (!nav || !aboutSection) return;

	if (window.scrollY > aboutSection.offsetTop - 660) {
		nav.style.backgroundColor = '#020e52';
		nav.style.boxShadow = '0px 1px 15px rgba(1,1,1,.18)';
	} else {
		nav.style.backgroundColor = 'transparent';
		nav.style.boxShadow = 'none';
	}
}

window.addEventListener('scroll', updateNavStyle, { passive: true });
updateNavStyle();

document.querySelectorAll('.page-scroll').forEach(function(link) {
	link.addEventListener('click', function(event) {
		const target = document.querySelector(link.getAttribute('href'));
		if (!target) return;

		event.preventDefault();
		target.scrollIntoView({
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
		});
	});
});

const contactForm = document.querySelector('.contact form');

if (contactForm) {
	contactForm.addEventListener('submit', function(event) {
		event.preventDefault();

		const formData = new FormData(contactForm);
		const name = formData.get('name').trim();
		const email = formData.get('email').trim();
		const message = formData.get('message').trim();
		const whatsappMessage = [
			'New inquiry - HK Marketing Agency',
			'',
			`Name: ${name}`,
			`Email: ${email}`,
			`Message: ${message}`,
			'',
			'طلب جديد - وكالة HK للتسويق',
			`الاسم: ${name}`,
			`البريد الإلكتروني: ${email}`,
			`الرسالة: ${message}`
		].join('\n');

		window.location.assign(`https://wa.me/201554853828?text=${encodeURIComponent(whatsappMessage)}`);
	});
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const growthVisual = document.querySelector('.growth-visual');
const revealTargets = document.querySelectorAll(
	'.about, .growth-visual, .services > h2, .services > .desc, .services-card, .news > h2, .insight-metrics, .contact .kiri, .contact form, .intouch > *'
);

let growthAnimations = [];

function replayGrowthAnimation() {
	if (!growthVisual) return;

	growthVisual.classList.add('is-animated');
	growthAnimations.forEach(function(animation) {
		animation.cancel();
	});
	growthAnimations = [];

	const duration = reduceMotion ? 450 : 1200;
	const easing = 'cubic-bezier(.22,.7,.2,1)';
	const animate = function(element, keyframes, delay) {
		if (element) {
			growthAnimations.push(element.animate(keyframes, { duration, delay, easing, fill: 'both' }));
		}
	};

	animate(growthVisual.querySelector('.chart-area'), [{ opacity: 0 }, { opacity: 1 }], 0);
	animate(growthVisual.querySelector('.chart-trend'), [
		{ strokeDashoffset: 900 },
		{ strokeDashoffset: 0 }
	], 0);
	growthVisual.querySelectorAll('.chart-bars rect').forEach(function(bar, index) {
		animate(bar, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], index * 120);
	});
	growthVisual.querySelectorAll('.chart-points circle').forEach(function(point, index) {
		animate(point, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], index * 180);
	});
	animate(growthVisual.querySelector('.chart-arrow'), [
		{ opacity: 0, transform: 'translateY(10px)' },
		{ opacity: 1, transform: 'translateY(0)' }
	], 650);
}

function animateMetric(metric) {
	const target = Number(metric.dataset.target);
	const decimals = Number(metric.dataset.decimals || 0);
	const prefix = metric.dataset.prefix || '';
	const suffix = metric.dataset.suffix || '';
	const duration = 1500;
	const startTime = performance.now();

	function updateMetric(now) {
		const progress = Math.min((now - startTime) / duration, 1);
		const easedProgress = 1 - Math.pow(1 - progress, 3);
		const value = (target * easedProgress).toFixed(decimals);
		metric.textContent = `${prefix}${value}${suffix}`;

		if (progress < 1) {
			window.requestAnimationFrame(updateMetric);
		}
	}

	window.requestAnimationFrame(updateMetric);
}

if (!reduceMotion && 'IntersectionObserver' in window) {
	const revealObserver = new IntersectionObserver(function(entries, observer) {
		entries.forEach(function(entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				if (entry.target.matches('.growth-visual')) {
					entry.target.classList.add('is-animated');
				}
				if (entry.target.matches('.insight-metrics')) {
					entry.target.querySelectorAll('[data-counter]').forEach(animateMetric);
				}
				observer.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.12,
		rootMargin: '0px 0px -40px 0px'
	});

	revealTargets.forEach(function(element, index) {
		element.classList.add('reveal-on-scroll');
		if (element.matches('.insight-metrics')) {
			element.classList.remove('reveal-on-scroll');
		}
		if (element.matches('.services-card, .intouch > *')) {
			element.style.transitionDelay = `${(index % 4) * 70}ms`;
		}
		revealObserver.observe(element);
	});
} else {
	revealTargets.forEach(function(element) {
		element.classList.add('is-visible');
	});
}

if (growthVisual) {
	growthVisual.addEventListener('pointerenter', replayGrowthAnimation);
	growthVisual.addEventListener('click', replayGrowthAnimation);
	growthVisual.addEventListener('keydown', function(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			replayGrowthAnimation();
		}
	});
}

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.appendChild(scrollProgress);

let progressFrame = 0;
window.addEventListener('scroll', function() {
	if (progressFrame) return;
	progressFrame = window.requestAnimationFrame(function() {
		const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
		const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
		scrollProgress.style.width = `${Math.min(progress, 1) * 100}%`;
		progressFrame = 0;
	});
}, { passive: true });

if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
	document.querySelectorAll('.services-card').forEach(function(card) {
		card.addEventListener('pointermove', function(event) {
			const bounds = card.getBoundingClientRect();
			const x = (event.clientX - bounds.left) / bounds.width;
			const y = (event.clientY - bounds.top) / bounds.height;
			card.style.setProperty('--tilt-x', `${(0.5 - y) * 4}deg`);
			card.style.setProperty('--tilt-y', `${(x - 0.5) * 4}deg`);
		});

		card.addEventListener('pointerleave', function() {
			card.style.setProperty('--tilt-x', '0deg');
			card.style.setProperty('--tilt-y', '0deg');
		});
	});
}