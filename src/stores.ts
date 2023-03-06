import { writable } from 'svelte/store'

interface UserSettings {
    nossr: boolean
}

const defaultSettings: UserSettings = {
    nossr: false,
}

export const userSettings = writable(defaultSettings)

function mergeObjects<T>(obj1: any, obj2: any): T {
    for (let prop in obj2) {
        if (!(prop in obj1)) {
            obj1[prop] = obj2[prop]
        }
    }
    return obj1
}

if (typeof window != 'undefined') {
    let oldUserSettings = JSON.parse(
        localStorage.getItem('settings') ?? JSON.stringify(defaultSettings)
    )

    userSettings.set(
        mergeObjects<UserSettings>(oldUserSettings, defaultSettings)
    )
}

userSettings.subscribe((settings) => {
    if (typeof window != 'undefined') {
        localStorage.setItem('settings', JSON.stringify(settings))
    }
})
