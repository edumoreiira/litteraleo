import { ChangeDetectionStrategy, Component, computed, HostBinding, input } from "@angular/core";

@Component({
    selector: "button[app-button], a[app-button]",
    template: `
    <ng-content></ng-content>
    @if(variant() === "combobox") {
        <i class="fi fi-rr-caret-down"></i>
    }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
    variant = input<"contained" | "outline" | "text" | "link" | "outline_static" | "combobox">("contained");
    baseless = input<boolean>(false);
    _size = input<"sm" | "base" | "lg" | "xl" | "2xl">("sm", { alias: "size" });

    private base = "py-1.5 rounded transition-[background-color,color,opacity] " +
    "disabled:opacity-50 disabled:cursor-not-allowed" 
    private size = computed(() => {
        return this._size() === "sm" ? "text-sm px-3" :
        this._size() === "base" ? "text-base px-[.9rem]" :
        this._size() === "lg" ? "text-lg px-[1.1rem]" :
        this._size() === "xl" ? "text-xl px-5" :
    "text-2xl px-6";
    })
    
    private contained = 
    "bg-primary text-primary-fg shadow-xs font-semibold " +
    "hover:opacity-85"

    private outline = "border border-border shadow-xs " +
    "hover:bg-accent"

    private outline_static = "bg-popover text-popover-fg border border-border shadow-xs"

    private combobox = this.outline_static + " flex items-center gap-2 ";

    private text = "text-fg hover:bg-accent font-normal";

    private link = "text-primary hover:underline cursor-pointer font-medium";

    @HostBinding("class")
    get variantClasses() {
        if (this.baseless()) {
            return `${ this[this.variant()] }`;
        } else {
            return `${ this.base } ${ this[this.variant()] } ${ this.size() }`;
        }
    }
}