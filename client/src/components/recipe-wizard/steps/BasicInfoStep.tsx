import { RecipeData } from "../../../../@customTypes/RecipeTypes";
import ImageUpload from "../../ImageUpload";

type Props = {
    recipe: Pick<RecipeData, "name" | "imageUrl" | "description" | "author" | "url">;
    onChange: <K extends keyof RecipeData>(key: K, value: RecipeData[K]) => void;
};

const BasicInfoStep = ({ recipe, onChange }: Props) => (
    <div>
        <h2 className="wz__step__title">Basic Info</h2>
        <p className="wz__step__subtitle">The essentials — name, photo, and a brief description.</p>

        <div className="wz__field">
            <label className="wz__label">Recipe Name *</label>
            <input
                className="wz__input"
                placeholder="e.g. Breakfast Potatoes"
                value={recipe.name}
                onChange={(e) => onChange("name", e.target.value)}
                autoFocus
            />
        </div>

        <div className="wz__field">
            <label className="wz__label">Cover Photo</label>
            <ImageUpload
                currentUrl={recipe.imageUrl}
                alt={recipe.name || "Recipe photo"}
                className="wz__cover_image"
                onUpload={(url) => onChange("imageUrl", url)}
            />
        </div>

        <div className="wz__field">
            <label className="wz__label">Description</label>
            <textarea
                className="wz__textarea"
                placeholder="A short description of the recipe..."
                value={recipe.description}
                onChange={(e) => onChange("description", e.target.value)}
            />
        </div>

        <div className="wz__grid2">
            <div className="wz__field">
                <label className="wz__label">Author</label>
                <input
                    className="wz__input"
                    placeholder="e.g. Chewie Kapur"
                    value={recipe.author}
                    onChange={(e) => onChange("author", e.target.value)}
                />
            </div>
            <div className="wz__field">
                <label className="wz__label">Source URL</label>
                <input
                    className="wz__input"
                    placeholder="https://..."
                    value={recipe.url}
                    onChange={(e) => onChange("url", e.target.value)}
                />
            </div>
        </div>
    </div>
);

export default BasicInfoStep;
