<script lang="ts">
  import { toggleMode, mode } from 'mode-watcher';
  import { Button } from '$lib/components/ui/button';
  import Sun from '@lucide/svelte/icons/sun';
  import Moon from '@lucide/svelte/icons/moon';
</script>

<Button variant="outline" size="icon" aria-label="Toggle dark mode" onclick={toggleMode}>
  {#if mode.current === 'dark'}
    <Sun />
  {:else}
    <Moon />
  {/if}
</Button>
