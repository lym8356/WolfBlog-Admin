import { Cropper } from "react-cropper";
import 'cropperjs/dist/cropper.css';

interface Props {
    imagePreview: string,
    setCropper: (cropper: Cropper) => void;
}

export const ImageCropper: React.FC<Props> = ({ imagePreview, setCropper }) => {
    return (
        <Cropper
            src={imagePreview}
            style={{ 
                height: "100%", width: '100%' 
            }}
            initialAspectRatio={1}
            // aspectRatio={1}
            preview='.img-preview'
            guides={false}
            viewMode={1}
            autoCropArea={2}
            background={false}
            onInitialized={cropper => setCropper(cropper)}
        />
    )
}