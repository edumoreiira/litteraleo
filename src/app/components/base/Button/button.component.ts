import { ChangeDetectionStrategy, Component, computed, HostBinding, input } from "@angular/core";

@Component({
    selector: "button[app-button], a[app-button]",
    template: `
        <ng-content></ng-content>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
    variant = input<"contained" | "outline" | "text">("contained");
    baseless = input<boolean>(false);
    _size = input<"sm" | "base" | "lg" | "xl" | "2xl">("sm", { alias: "size" });

    private base = "py-[.35rem] rounded font-medium"
    private size = computed(() => {
        return this._size() === "sm" ? "text-sm px-3" :
        this._size() === "base" ? "text-base px-[.9rem]" :
        this._size() === "lg" ? "text-lg px-[1.1rem]" :
        this._size() === "xl" ? "text-xl px-5" :
    "text-2xl px-6";
    })
    
    private contained = 
    "bg-primary text-primary-fg font-semibold shadow-xs " +
    "hover:bg-primary-400 transition-all"

    private outline = "border border-border shadow-xs " +
    "hover:bg-accent transition-all"

    private text = "text-fg hover:bg-accent transition-all";

    @HostBinding("class")
    get variantClasses() {
        if (this.baseless()) {
            return `${ this[this.variant()] }`;
        } else {
            return `${ this.base } ${ this[this.variant()] } ${ this.size() }`;
        }
    }
}