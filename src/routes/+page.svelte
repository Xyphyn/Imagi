<script lang="ts">
    import Live from '$lib/misc/Live.svelte'
    import type {
        CommunitiesResponse,
        PostsResponse,
    } from '$lib/types/pb-types'
    import { onDestroy, onMount } from 'svelte'
    import { currentUser, pb } from '$lib/pocketbase'
    import PostList from '$lib/posts/PostList.svelte'
    import Button from '$lib/Button.svelte'
    import nProgress from 'nprogress'
    import Colored from '$lib/misc/Colored.svelte'
    import Loader from '$lib/Loader.svelte'
    import Avatar from '$lib/Avatar.svelte'
    import RowSkeleton from '$lib/skeletons/RowSkeleton.svelte'

    let posts: PostsResponse<any>[] | undefined
    let communities: CommunitiesResponse<any>[] | undefined

    let sort: 'recent' | 'following' = 'recent'
    let page = 1

    async function fetchPage(p: number) {
        nProgress.start()

        if (p < 1) {
            page = 1
        }

        let filterString = ''
        if ($currentUser?.communities) {
            filterString = $currentUser?.communities
                .map((community: string) => `community.id = "${community}"`)
                .join(' || ')
        }

        const results = await pb
            .collection('posts')
            .getList<PostsResponse<any>>(p, 50, {
                expand: 'user,postCounts(post),community',
                sort: '-created',
                filter: sort == 'following' ? filterString : '',
            })

        if (p > Math.ceil(results.totalItems / 50)) {
            page--
        }

        posts = results.items

        nProgress.done()
    }

    onMount(async () => {
        fetchPage(page)

        pb.collection('communities')
            .getList<CommunitiesResponse>(1, 50, {
                sort: '-created',
            })
            .then((data) => {
                communities = data.items
            })

        pb.collection('posts').subscribe<PostsResponse<any>>(
            '*',
            async ({ record, action }) => {
                if (action == 'create') {
                    if (sort == 'following') {
                        if (
                            !$currentUser?.communities.includes(
                                record.community
                            )
                        ) {
                            return
                        }
                    }

                    const user = await pb
                        .collection('users')
                        .getOne(record.user)

                    let stats = await pb
                        .collection('postCounts')
                        .getOne(record.id)

                    if (record.community) {
                        const community = await pb
                            .collection('communities')
                            .getOne(record.community)

                        record.expand = {
                            user,
                            community,
                            'postCounts(post)': [stats],
                        }
                    } else {
                        record.expand = { user, 'postCounts(post)': [stats] }
                    }

                    posts = [record, ...posts!]
                }

                if (action == 'delete') {
                    posts = posts?.filter((post) => post.id != record.id)
                }
            }
        )
    })
</script>

<title>Imagi</title>
<h1 class="m-4 mt-0 text-4xl font-bold"><Colored>Communities</Colored></h1>
<div class="flex overflow-auto flex-row gap-4 m-4 h-12">
    {#if communities}
        {#each communities as community}
            <div class="flex flex-row flex-shrink-0 gap-2 items-center h-8">
                <Avatar
                    user={community}
                    type="community"
                    width={32}
                    thumbnail="32x32"
                />
                <a href={`/community/${community.name}`}>{community.name}</a>
            </div>
        {/each}
    {:else}
        {#each new Array(15) as items}
            <RowSkeleton />
        {/each}
    {/if}
</div>
<h1 class="m-4 mt-0 text-4xl font-bold">
    <Colored>Posts</Colored>
</h1>
<div class="flex flex-row gap-4 mb-4 ml-4">
    <Button
        major={sort == 'recent'}
        onclick={() => {
            sort = 'recent'
            fetchPage(page)
        }}>Recent</Button
    >
    <Button
        major={sort == 'following'}
        onclick={() => {
            sort = 'following'
            fetchPage(page)
        }}>Following</Button
    >
</div>

<Live />
<PostList {posts} />
{#if posts}
    <div
        class="flex flex-row gap-4 justify-center items-center mx-auto w-full box-border"
    >
        <Button onclick={() => fetchPage(--page)}>Back</Button>
        <span>{page}</span>
        <Button onclick={() => fetchPage(++page)}>Next</Button>
    </div>
{/if}
