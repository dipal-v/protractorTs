/**
 * The Space to Hyphen Value Converter
 */
export class SpaceToHyphenValueConverter {

    /**
     * override to view
     */
    public toView(value) {
        return value.replace(/\s+/g, '-');
    }

}
