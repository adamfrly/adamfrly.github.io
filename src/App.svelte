<script>
	export let name;
</script>

<main>
	<h1>Welcome to {name}'s Website</h1>
	<p>He is currently learning Svelte and how to make a personal website. Please check back later for updates.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>