<script lang="ts">
    import { pb } from '$lib/pocketbase'
    import PostSkeleton from '$lib/skeletons/PostSkeleton.svelte'
    import { onMount } from 'svelte'
    import { flip } from 'svelte/animate'
    import Loader from '../Loader.svelte'
    import type {
        PostsResponse,
        UsersRecord,
        UsersResponse,
    } from '../types/pb-types'
    import Post from './Post.svelte'
    import PostView from './PostView.svelte'

    export let posts: PostsResponse<UsersResponse>[] | undefined

    let open = false
</script>

<div
    class="grid grid-cols-1 gap-4 p-4 w-full sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
>
    {#if !posts}
        {#each new Array(50) as items}
            <PostSkeleton />
        {/each}
    {:else}
        {#each posts as post (post.id)}
            <div animate:flip={{ duration: 500 }} class="w-full h-full">
                <div class="w-full h-full popin">
                    <Post {post} bind:open />
                </div>
            </div>
        {/each}
    {/if}
</div>
<PostView bind:open />
