<script>
    import Footer from "$lib/page/LandingPage/components/Footer/Footer.svelte";
    import ContactForm from "$lib/components/Form/ContactForm/ContactForm.svelte";
    import {userProfile} from "$lib/page/stores/userProfile/userProfile.js";
    import NavBar from "$lib/page/protected/components/NavBar/NavBar.svelte";

    export let data;
    userProfile.set(data.userProfile);

    let tabs = ["Home","Features","For Businesses","For Employees","Pricing","Contact"];


</script>

<div class="relative flex flex-col h-full w-full">
    <div class="sticky-header lg:block hidden">
        <NavBar landingPage={true} bind:tabs/>
    </div>
    <div class="sticky-sidebar lg:hidden w-fit">
        <NavBar landingPage={true} bind:tabs/>
    </div>

    <!-- Hero Section -->
    <section id="home" class="bg-blue-300 text-white text-center flex flex-col justify-center items-center h-screen">
        <div class="p-5">
            <h1 class="text-5xl font-bold mb-4">Simplify Your Scheduling</h1>
            <p class="text-xl mb-4">Discover a seamless way to manage appointments and schedules with our intuitive interface.</p>
            <a href="#contact" class="bg-white text-blue-500 px-6 py-2 rounded-full font-bold transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white">Get Started</a>
        </div>
    </section>


    <!-- Features Section -->
    <section id="features" class="text-center flex flex-col justify-center items-center h-screen">
        <h2 class="text-4xl font-bold">Features</h2>
        <div class="flex flex-wrap justify-center items-center mt-4">
            <div class="m-4 p-4 border rounded-lg">
                <h3 class="font-semibold text-lg">Real-time Scheduling</h3>
                <p>Book and update appointments instantly without delays, perfect for dynamic business environments.</p>
            </div>
            <div class="m-4 p-4 border rounded-lg">
                <h3 class="font-semibold text-lg">Multiple Guest Bookings</h3>
                <p>Facilitate group appointments easily, enhancing customer experience and expanding service options.</p>
            </div>
            <div class="m-4 p-4 border rounded-lg">
                <h3 class="font-semibold text-lg">SMS Notifications</h3>
                <p>Automatically send reminders and reduce no-shows, keeping both customers and staff updated in real-time.</p>
            </div>
        </div>
    </section>

    <!-- For Businesses -->
    <section id="for-businesses" class="bg-gray-100 text-center flex flex-col justify-center items-center h-screen">
        <h2 class="text-4xl font-bold">For Businesses</h2>
        <p class="mx-auto max-w-prose">Optimize your operational efficiency with tools designed for managing small business sizes. Enjoy streamlined scheduling, comprehensive employee management, and customer engagement in one platform.</p>
        <a href="#contact" class="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full font-bold">Learn More</a>
    </section>

    <!-- For Employees -->
    <section id="for-employees" class="text-center flex flex-col justify-center items-center h-screen">
        <h2 class="text-4xl font-bold">For Employees</h2>
        <p>Manage your schedule, track your tasks, and stay informed on the go. Our platform ensures you have all the necessary tools at your fingertips, enabling a better work-life balance.</p>
        <a href="#contact" class="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full font-bold">Discover How</a>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="bg-gray-100 text-center flex flex-col justify-center items-center h-screen">
        <h2 class="text-4xl font-bold">Pricing Plans</h2>
        <p>Flexible and transparent pricing tailored to your business needs. For detailed plans and custom solutions,</p>
        <a href="#contact" class="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full font-bold">Contact Us</a>
    </section>


    <!-- Contact Form Section -->
    <section id="contact" class="text-center flex flex-col justify-center items-center h-screen">
        <h2 class="text-4xl font-bold">Contact Us</h2>
        <p class="mb-4">Have questions or need help? Get in touch with our team today.</p>
        <div class="w-full max-w-md mx-auto">
            <ContactForm />
        </div>
    </section>


    <Footer/>
</div>

<style>
    .sticky-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        background-color: #2D3748;
        width: 100%;
        height: 60px; /* Specify the height of your header */
    }

    .sticky-sidebar {
        position: sticky;
        top: 0;
        z-index: 1006;
    }

    section {
        padding: 2rem;
    }
</style>