<script>
	import welcome from '$lib/images/landing/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/landing/svelte-welcome.png';
	import Header from "$lib/components/Header/Header.svelte";
	import Footer from "$lib/components/Footer/Footer.svelte";
	import ContactForm from "$lib/components/Form/ContactForm/ContactForm.svelte";

	let tabs = [
		{ name: "Login", link: "/protected" },
		{ name: "About", link: "/about" },
	];
</script>

<svelte:head>
	<title>bookingwith.me Home</title>
	<meta name="bookingwith.me home page" content="Welcome to bookingwith.me" />
</svelte:head>

<div class="relative flex flex-col w-full min-h-screen">
	<div class="z-10 sticky top-0">
		<Header {tabs}/>
	</div>

	<section>
			<span class="welcome">
				<picture>
					<source srcset={welcome} type="image/webp" />
					<img src={welcome_fallback} alt="Welcome" />
				</picture>
			</span>

		<div class="text-3xl sm:text-4xl md:text-5xl text-center lg:text-left">
			<div class="text-red-500">Let's enhance your customer booking experience together.</div>
		</div>

		<div class="flex flex-col sm:items-center md:flex-row md:items-start justify-center gap-6 md:gap-8 lg:gap-10 mt-6 lg:mt-10">
			<div class="flex-1 text-center lg:text-left">
				<p class="text-base sm:text-lg md:text-xl">
					Curious what secrets lie within the art of seamless bookings?
					<br>
					Share your details to unlock the
					<span class="text-emerald-500">risk-free</span>
					mystery gift. Let’s whip up something amazing together!
				</p>
			</div>

			<div class="flex-1">
				<div class="p-8 bg-white shadow-md rounded-lg">
					<ContactForm/>
				</div>
			</div>
		</div>
	</section>

	<Footer/>
</div>

<style>
	section {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
