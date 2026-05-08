<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.ico';
  import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
  import { ModeWatcher } from 'mode-watcher';

  let { children } = $props();
</script>

<ModeWatcher />
<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="apple-touch-icon" href={appleTouchIcon} />
</svelte:head>
{@render children()}
