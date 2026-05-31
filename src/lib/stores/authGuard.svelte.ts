import { page } from "$app/state";
import { goto } from "$app/navigation";
import { user } from "$lib/stores/user.svelte";
import { resolve } from "$app/paths";

const authRoutes = ['/login', '/register'];

export function useAuthGuard() {
    $effect(() => {
        const currentPath = page.url.pathname;
        const isAuthenticated = user.authenticated;

        if (isAuthenticated && authRoutes.includes(currentPath)) {
            goto(resolve('/'), { replaceState: true });
        }
    });
}