<script>
	import Gallery from "../components/Gallery.svelte";
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
	:global(img) { opacity: .9; transition: all .2s }
	:global(img):hover { opacity: 1; transform: scale(1.04) }
</style>

<Gallery>
	<img src="https://via.placeholder.com/180x200/1" alt="">
	<img src="https://via.placeholder.com/200x280/1" alt="">
	<img src="https://via.placeholder.com/250x200/1" alt="">
	<img src="https://via.placeholder.com/140x310/1" alt="">
	<img src="https://via.placeholder.com/280x300/1" alt="">
	<img src="https://via.placeholder.com/220x100/1" alt="">
	<img src="https://via.placeholder.com/180x150/1" alt="">
	<img src="https://via.placeholder.com/210x180/1" alt="">
	<img src="https://via.placeholder.com/210x200/1" alt="">
	<img src="https://via.placeholder.com/200x250/1" alt="">
	<img src="https://via.placeholder.com/220x200/1" alt="">
	<img src="https://via.placeholder.com/180x240/1" alt="">
	<img src="https://via.placeholder.com/210x210/1" alt="">
	<img src="https://via.placeholder.com/200x220/1" alt="">
	<img src="https://via.placeholder.com/210x200/1" alt="">
	<img src="https://via.placeholder.com/180x200/1" alt="">
	<img src="https://via.placeholder.com/200x280/1" alt="">
	<img src="https://via.placeholder.com/250x200/1" alt="">
	<img src="https://via.placeholder.com/140x210/1" alt="">
	<img src="https://via.placeholder.com/280x200/1" alt="">
	<img src="https://via.placeholder.com/220x100/1" alt="">
	<img src="https://via.placeholder.com/180x150/1" alt="">
	<img src="https://via.placeholder.com/210x180/1" alt="">
	<img src="https://via.placeholder.com/210x200/1" alt="">
	<img src="https://via.placeholder.com/200x250/1" alt="">
	<img src="https://via.placeholder.com/220x200/1" alt="">
	<img src="https://via.placeholder.com/180x240/1" alt="">
	<img src="https://via.placeholder.com/210x210/1" alt="">
	<img src="https://via.placeholder.com/200x220/1" alt="">
	<img src="https://via.placeholder.com/210x200/1" alt="">
</Gallery>