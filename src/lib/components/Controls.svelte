<script lang="ts">
  import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
  import { Button } from '$lib/components/ui/button';

  interface Props {
    onDelete?: () => void;
    onShuffle?: () => void;
    onEnter?: () => void;
  }

  let { onDelete, onShuffle, onEnter }: Props = $props();
</script>

<div class="mt-6 flex flex-wrap justify-center gap-4">
  <Button variant="outline" size="pill-lg" onclick={() => onDelete?.()}>Delete</Button>
  <Button
    variant="outline"
    size="icon-xl"
    aria-label="Shuffle letters"
    onclick={() => onShuffle?.()}
  >
    <RotateCcw size={18} />
  </Button>
  <Button variant="outline" size="pill-lg" onclick={() => onEnter?.()}>Enter</Button>
</div>
