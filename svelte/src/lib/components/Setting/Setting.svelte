<div class="flex flex-col items-center justify-center h-screen">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div class="flex flex-col items-center space-y-6">
            <a href="/report"
               class="flex items-center px-6 py-3 text-white bg-red-500 rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition ease-in-out duration-150 transform hover:scale-105">
                <svg class="w-6 h-6 text-gray-200 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14v7M5 4.971v9.541c5.6-5.538 8.4 2.64 14-.086v-9.54C13.4 7.61 10.6-.568 5 4.97Z"/>
                </svg>
                Report
            </a>

            <form class="auth-form flex flex-col items-center" method="post" action="?/logout">
                <button class="flex items-center px-6 py-3 text-white bg-blue-500 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150 transform hover:scale-105" type="submit">
                    <svg class="w-6 h-6 text-gray-200 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
                    </svg>
                    Logout
                </button>
            </form>
        </div>
    </div>
</div>