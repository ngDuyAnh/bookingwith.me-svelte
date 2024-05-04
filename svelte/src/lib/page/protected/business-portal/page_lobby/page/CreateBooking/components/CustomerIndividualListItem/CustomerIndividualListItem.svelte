<script>
    export let customerIndividual;
    export let index;
    export let openModalCustomerIndividual;
    export let removeCustomerIndividual;

    function handleClick() {
        openModalCustomerIndividual(index, customerIndividual);
    }

    function handleRemove() {
        removeCustomerIndividual(index);
    }
</script>

<li class="list-item">
    <div class="flex w-full items-center hover:bg-gray-200">
        <button class="w-full flex items-center justify-start p-2"
                on:click={handleClick} type="button">
            <span>Customer {index + 1}</span>
        </button>

        <!-- Removal Button -->
        <button class="ml-2 flex-shrink-0 p-3 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 text-red-600"
                on:click={handleRemove} type="button">
            Remove
        </button>
    </div>
</li>
