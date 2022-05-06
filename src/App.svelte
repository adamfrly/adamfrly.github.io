<script lang="ts">
	import Gallery from "./Gallery.svelte";
	import handleClick from "./Gallery.svelte";
	import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
  } from '@smui/card';

  let noteBgColor = '#f4ed2a';
  let noteColor = '#FF5555';
  // let windowSize = ; // TODO make a variable length column size
  $: cssVarStyles = `--note-color:${noteColor};--note-bg-color:${noteBgColor}`;

  import { MasonryInfiniteGrid } from "@egjs/svelte-infinitegrid"; // TODO Figure out why this throws an error but still works

  let items = getItems(0, 10);

  function getItems(nextGroupKey, count) {
    const nextItems = [];

    for (let i = 0; i < count; ++i) {
      const nextKey = nextGroupKey * count + i;

      nextItems.push({ groupKey: nextGroupKey, key: nextKey });
    }
    return nextItems;
  }
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
	:global(img) { opacity: .99; transition: all .2s }
	:global(img):hover { opacity: 1; transform: scale(1.04) }

	/* * :global(.card-media-16x9) {
		background-image: url(https://place-hold.it/320x180?text=16x9&fontsize=23);
	}
	
	* :global(.card-media-square) {
		background-image: url(https://place-hold.it/320x320?text=square&fontsize=23);
	} */

	html, body {
	position: relative;
	margin: 0;
	padding: 0;
	height: 100%;
	background: #fff;
	}

	a {
	color: unset;
	text-decoration: none;
	}

	.header {
	text-align: center;
	background: #333;
	color: #fff;
	padding: 20px 0px;
	margin: 0;
	margin-bottom: 10px;
	}

	.description {
	padding: 6px 30px;
	margin: 0;
	font-weight: 400;
	}

	.description li {
	padding: 3px 0px;
	}

	.wrapper {
	margin-top: 50px;
	}

	.container {
	width: 100%;
	height: 600px;
	}

	.item {
	display: inline-block;
	width: 250px;
	opacity: 1;
	}

	.masonrygrid.horizontal .item {
	width: auto;
	height: 250px; /* TODO make it a variable length column size*/
	}

	.item .thumbnail {
	overflow: hidden;
	border-radius: 2px;
	}

	.item .thumbnail img {
	width: 100%;
	border-radius: 8px;
	}

	.masonrygrid.horizontal .item .thumbnail img {
	width: auto;
	height: 210px;
	}

	.item .info {
	margin-top: 10px;
	font-weight: bold;
	color: #777;
	}

	.item.animate {
	transition: opacity ease 1s;
	transition-delay: 0.2s;
	opacity: 1;
	}

	.placeholder {
	width: 250px;
	border-radius: 5px;
	background: #eee;
	height: 250px;
	}


	.loading {
	position: absolute;
	width: 100%;
	height: 50px;
	line-height: 50px;
	text-align: center;
	font-weight: bold;
	}

	.button-area {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	text-align: center;
	height: 50px;
	z-index: 1;
	}
</style>

<main>
	<h1>Welcome to Adam's Website</h1>
	<p>He is currently learning Svelte and how to make a personal website. Please check back later for updates.</p>
	<p>In the mean time, enjoy these pics.</p>
</main>


<MasonryInfiniteGrid
  class="container"
  gap={1}
  {items}
  on:requestAppend={({ detail: e }) => {
    const nextGroupKey = (+e.groupKey || 0) + 1;

    items = [...items, ...getItems(nextGroupKey, 10)];
  }}
  let:visibleItems
>
  {#each visibleItems as item (item.key)}
    <div class="item">
      <div class="thumbnail">
        <a href="https://www.youtube.com/watch?v=oYmqJl4MoNI" target="_blank">
			<img
			src={`https://naver.github.io/egjs-infinitegrid/assets/image/${
				(item.key % 33) + 1
			}.jpg`}
			alt="egjs"
			style="width: 100%; height: 100%"
			/>
		 </a>
      </div>
    </div>
  {/each}
</MasonryInfiniteGrid>


<!-- <Gallery loading="eager">
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


</Gallery> -->