<script lang="ts">
    // @ts-nocheck - Because typescript is being stupid.

    import { goto } from '$app/navigation'
    import {
        Menu,
        MenuButton,
        MenuItem,
        MenuItems,
        Transition,
    } from '@rgossiaux/svelte-headlessui'
    import Button from './Button.svelte'
    import { currentUser, pb } from './pocketbase'
    import {
        Icon,
        ArrowLeftOnRectangle,
        UserCircle,
        Plus,
        Cog6Tooth,
        Newspaper,
        GlobeAlt,
        PencilSquare,
    } from 'svelte-hero-icons'
    import Upload from './views/Upload.svelte'
    import Colored from './misc/Colored.svelte'
    import CreateCommunity from './views/CreateCommunity.svelte'

    interface Menus {
        upload: boolean
        community: boolean
    }

    let views: Menus = {
        upload: false,
        community: false,
    }
</script>

<nav
    class="flex sticky top-0 z-10 flex-row gap-4 items-center p-4 my-4 w-full h-16"
>
    <a class="flex flex-row items-center mr-auto hover:cursor-pointer" href="/">
        <img
            src="/logo.svg"
            alt="Imagi logo"
            class="object-cover w-12 h-12"
            width={48}
            height={48}
        />
        <span class="hidden gap-2 items-center text-2xl font-bold md:flex"
            >imagi <span
                class="py-1 px-2 text-base text-black bg-gradient-to-br rounded-md from-primary to-secondary"
                >BETA</span
            >
        </span>
    </a>
    <Button major={false} onclick={() => goto('/explore')} label="Explore"
        ><Icon src={GlobeAlt} size="20" /><span class="hidden sm:block"
            >Explore</span
        ></Button
    >
    <Menu class="menu">
        <MenuButton>
            <Button major={true} label="Create"
                ><Icon src={Plus} size="20" /><span class="hidden sm:block"
                    >Create</span
                >
            </Button>
        </MenuButton>
        <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <MenuItems class="menu-items">
                <Colored><h1 class="text-2xl font-bold">Create</h1></Colored>
                <MenuItem>
                    <Button
                        class="menu-item"
                        onclick={() => (views.upload = true)}
                        ><Icon src={PencilSquare} width="20" /> Post</Button
                    >
                </MenuItem>
                <MenuItem>
                    <Button
                        class="menu-item"
                        onclick={() => (views.community = true)}
                        ><Icon src={Newspaper} width="20" /> Community</Button
                    >
                </MenuItem>
            </MenuItems>
        </Transition>
    </Menu>
    {#if $currentUser}
        <Menu class="menu">
            <MenuButton>
                <img
                    src={pb.getFileUrl($currentUser, $currentUser.avatar, {
                        thumb: '128x128',
                    })}
                    alt="Profile"
                    class="object-cover w-12 rounded-full cursor-pointer aspect-square"
                /></MenuButton
            >
            <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems class="menu-items">
                    <Colored
                        ><h1 class="text-2xl font-bold">
                            {$currentUser.username}
                        </h1></Colored
                    >
                    <MenuItem>
                        <Button
                            class="menu-item"
                            onclick={() =>
                                goto(`/user/${$currentUser.username}`)}
                        >
                            <Icon src={UserCircle} size="20" />
                            Profile
                        </Button>
                    </MenuItem>
                    <MenuItem>
                        <Button
                            class="menu-item"
                            onclick={() => goto(`/settings`)}
                        >
                            <Icon src={Cog6Tooth} size="20" />
                            Settings
                        </Button>
                    </MenuItem>
                    <MenuItem>
                        <Button
                            class="menu-item"
                            onclick={() => pb.authStore.clear()}
                            ><Icon src={ArrowLeftOnRectangle} size="20" />Log
                            Out</Button
                        ></MenuItem
                    >
                </MenuItems></Transition
            >
        </Menu>
    {:else}
        <Button onclick={() => goto('/login')}>Login</Button>
    {/if}
</nav>
<Upload bind:open={views.upload} />
<CreateCommunity bind:open={views.community} />
