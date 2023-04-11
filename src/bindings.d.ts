export type Bindings = {
    OPINE: D1Database;
}

declare global {
    function getMiniflareBindings(): Bindings
}