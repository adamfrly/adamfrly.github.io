<script>
	import Gallery from "../components/Gallery.svelte";
	export let name;
</script>

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

<main>
	<h1>Welcome to {name}'s Website</h1>
	<p>He is currently learning Svelte and how to make a personal website. Please check back later for updates.</p>
	<p>In the mean time, enjoy these pics.</p>
</main>

<Gallery>
	<img src="images/wisconsin.jpg" alt="">
	<img src="images/dontgiveup.jpg" alt="">
	<img src="images/china.jpg" alt="">
	<img src="images/pose.jpg" alt="">
	<img src="images/pray.jpg" alt="">
	<img src="images/ape.jpg" alt="">
	<img src="images/avatar.jpg" alt="">
	<img src="images/truck.jpg" alt="">
	<img src="images/knuckles.jpg" alt="">
	<img src="images/brocoli.jpg" alt="">
	<img src="images/tyler.jpg" alt="">
	<img src="images/bow.jpg" alt="">
	<img src="images/meat.jpg" alt="">
	<img src="images/dog.jpg" alt="">
	<img src="images/pigeons.jpg" alt="">
	<img src="images/marketing.jpg" alt="">
	<img src="images/garfield.jpg" alt="">


</Gallery>