<script lang="ts">
	import Gallery from "../components/Gallery.svelte";
	import handleClick from "../components/Gallery.svelte";
	import Card, {
    Content,
    PrimaryAction,
    Media,
    MediaContent,
  } from '@smui/card';

  let clicked = 0;

  import { MasonryInfiniteGrid } from "@egjs/svelte-infinitegrid";

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
	:global(img) { opacity: .9; transition: all .2s }
	:global(img):hover { opacity: 1; transform: scale(1.04) }

	* :global(.card-media-16x9) {
		background-image: url(https://place-hold.it/320x180?text=16x9&fontsize=23);
	}
	
	* :global(.card-media-square) {
		background-image: url(https://place-hold.it/320x320?text=square&fontsize=23);
	}
</style>

<main>
	<h1>Welcome to Adam's Website</h1>
	<p>He is currently learning Svelte and how to make a personal website. Please check back later for updates.</p>
	<p>In the mean time, enjoy these pics.</p>
</main>

<MasonryInfiniteGrid
  class="container"
  gap={5}
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
		<a href="https://www.youtube.com/watch?v=oYmqJl4MoNI">
			<img
			src={`https://naver.github.io/egjs-infinitegrid/assets/image/${
				(item.key % 33) + 1
			}.jpg`}
			alt="egjs" 
			/>
		 </a>
      </div>
      <div class="info">{`egjs ${item.key}`}</div>
    </div>
  {/each}
</MasonryInfiniteGrid>

<!--
<div class="card-display">
	<div class="card-container">
	  <Card>
		<Media class="card-media-16x9" aspectRatio="16x9">
		  <MediaContent>
			<h2
			  class="mdc-typography--headline6"
			  style="color: #fff; position: absolute; bottom: 16px; left: 16px; margin: 0;"
			>
			  A card with 16x9 media.
			</h2>
		  </MediaContent>
		</Media>
		<Content style="color: #888;">Here's some gray text down here.</Content>
	  </Card>
	</div>
   
	<div class="card-container">
	  <Card style="min-width: 300px;">
		<Media class="card-media-square" aspectRatio="square">
		  <div style="color: #fff; position: absolute; bottom: 16px; left: 16px;">
			<h2 class="mdc-typography--headline6" style="margin: 0;">
			  A card with square media.
			</h2>
			<h3 class="mdc-typography--subtitle2" style="margin: 0;">
			  And a subtitle.
			</h3>
		  </div>
		</Media>
	  </Card>
	</div>
   
	<div class="card-container">
	  <Card>
		<div style="padding: 1rem;">
		  <h2 class="mdc-typography--headline6" style="margin: 0;">
			A card with media.
		  </h2>
		  <h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
			And a subtitle.
		  </h3>
		</div>
		<PrimaryAction on:click={() => clicked++}>
		  <Media class="card-media-16x9" aspectRatio="16x9" />
		  <Content class="mdc-typography--body2">
			And some info text. And the media and info text are a primary action
			for the card.
		  </Content>
		</PrimaryAction>
	  </Card>
	</div>
  </div>
-->

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