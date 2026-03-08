// lib/comfyui.ts — Success Workflow Template (SDXL Turbo 2-Step HD)

export interface InstallationParams {
    subject: string;
    style: string;
    attributes: string[];
}

export function buildArtisticPrompt(params: InstallationParams): string {
    const attrText = params.attributes.length ? params.attributes.join(", ") : "";
    // El estilo al PRINCIPIO es clave para el modelo Turbo
    return `(Style: ${params.style}), A breathtaking ${params.subject} ${attrText}. (Exquisite detail, atmospheric composition, emotional depth, trending on artstation, majestic, iconic imagery:1.2).`;
}

export function buildWorkflow(params: { prompt: string; seed?: number; ckpt?: string }): Record<string, any> {
    const {
        prompt,
        seed = Math.floor(Math.random() * 9999999999999),
        ckpt = "sd_xl_turbo_1.0_fp16.safetensors"
    } = params;

    return {
        "5": { "inputs": { "width": 512, "height": 768, "batch_size": 1 }, "class_type": "EmptyLatentImage" },
        "6": { "inputs": { "text": prompt, "clip": ["20", 1] }, "class_type": "CLIPTextEncode" },
        "7": { "inputs": { "text": "text, watermark, blurry, low quality, distorted", "clip": ["20", 1] }, "class_type": "CLIPTextEncode" },
        "8": { "inputs": { "samples": ["13", 0], "vae": ["20", 2] }, "class_type": "VAEDecode" },
        "13": {
            "inputs": {
                "add_noise": true, "noise_seed": seed, "cfg": 1, "model": ["20", 0],
                "positive": ["6", 0], "negative": ["7", 0], "sampler": ["14", 0],
                "sigmas": ["22", 0], "latent_image": ["5", 0]
            }, "class_type": "SamplerCustom"
        },
        "14": { "inputs": { "sampler_name": "euler_ancestral" }, "class_type": "KSamplerSelect" },
        "20": { "inputs": { "ckpt_name": ckpt }, "class_type": "CheckpointLoaderSimple" },
        "22": { "inputs": { "steps": 2, "denoise": 1, "model": ["20", 0] }, "class_type": "SDTurboScheduler" },
        "27": { "inputs": { "filename_prefix": "museum_art", "images": ["8", 0] }, "class_type": "SaveImage" }
    };
}
