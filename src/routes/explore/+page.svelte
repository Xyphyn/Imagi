<script lang="ts">
    import { goto } from '$app/navigation'

    // @ts-ignore
    import Avatar from '$lib/Avatar.svelte'
    import Loader from '$lib/Loader.svelte'
    import Colored from '$lib/misc/Colored.svelte'
    import { pb } from '$lib/pocketbase'
    import RowSkeleton from '$lib/skeletons/RowSkeleton.svelte'
    import type {
        CommunitiesResponse,
        UsersResponse,
    } from '$lib/types/pb-types'
    import { onMount } from 'svelte'

    let users: UsersResponse[] | undefined
    let communities: CommunitiesResponse[] | undefined

    onMount(async () => {
        pb.collection('users')
            .getList<UsersResponse>(1, 40, { sort: '-created' })
            .then((data) => {
                users = data.items
            })

        pb.collection('communities')
            .getList<CommunitiesResponse>(1, 40, { sort: '-created' })
            .then((data) => {
                communities = data.items
            })
    })
</script>

<title>Imagi | Explore</title>
<div class="flex flex-col items-center p-4 box-border">
    <h1 class="text-4xl font-bold md:self-start"><Colored>Explore</Colored></h1>
    <span class="self-start mt-4">New Users</span>
    <div class="flex overflow-auto flex-row gap-4 self-start h-12 box-border">
        {#if !users}
            <div class="flex flex-row flex-shrink-0 gap-2 items-center h-8">
                <div
                    class="w-8 h-8 bg-white rounded-full animate-pulse dark:bg-slate-700"
                />
                <div
                    class="w-24 h-8 bg-white rounded-full animate-pulse dark:bg-slate-700"
                />
            </div>
        {:else}
            {#each users as user}
                <div class="flex flex-row flex-shrink-0 gap-2 items-center">
                    <Avatar {user} width={32} thumbnail="32x32" />
                    <a href={`/user/${user.username}`}>{user.username}</a>
                </div>
            {/each}
        {/if}
    </div>
    <span class="self-start mt-4">New Communities</span>
    <div
        class="grid grid-cols-1 gap-4 mt-4 w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
    >
        {#if !communities}
            <RowSkeleton />
        {:else}
            {#each communities as community}
                <div
                    class="flex gap-4 justify-center items-center p-6 w-full bg-white rounded-lg shadow-lg transition-transform transform-gpu cursor-pointer dark:bg-slate-800 flex-row
  hover:-translate-y-1"
                    on:click={() => goto(`/community/${community.name}`)}
                    on:keypress={() => goto(`/community/${community.name}`)}
                >
                    <Avatar
                        user={community}
                        type="community"
                        width={48}
                        thumbnail="48x48"
                    />
                    <div class="flex flex-col">
                        <span class="text-lg font-bold"
                            ><Colored>{community.name}</Colored></span
                        >
                        <span class="text-sm opacity-70"
                            >{community.description}</span
                        >
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
