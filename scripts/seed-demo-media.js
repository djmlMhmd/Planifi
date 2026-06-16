const fs = require('fs/promises');
const path = require('path');
const { Client } = require('pg');
const { execFile } = require('child_process');
const { promisify } = require('util');

const projectRoot = path.resolve(__dirname, '..');
const profileDir = path.join(projectRoot, 'public', 'uploads', 'profile-picture', 'demo');
const serviceDir = path.join(projectRoot, 'public', 'uploads', 'service-images', 'demo');
const sourceCacheDir = path.join(projectRoot, 'tmp', 'demo-media-sources');
const execFileAsync = promisify(execFile);

const dbConfig = {
	user: 'planifi',
	host: 'localhost',
	database: 'postgres',
	password: 'password',
	port: 5432,
};

const sources = {
	portrait01: {
		url: 'https://images.pexels.com/photos/33867543/pexels-photo-33867543.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	portrait02: {
		url: 'https://images.pexels.com/photos/33867533/pexels-photo-33867533.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	portrait03: {
		url: 'https://images.pexels.com/photos/33867535/pexels-photo-33867535.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	portrait04: {
		url: 'https://images.pexels.com/photos/20638028/pexels-photo-20638028.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	portrait05: {
		url: 'https://images.pexels.com/photos/19225108/pexels-photo-19225108.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	portrait06: {
		url: 'https://images.pexels.com/photos/18367694/pexels-photo-18367694.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	portrait07: {
		url: 'https://images.pexels.com/photos/18809789/pexels-photo-18809789.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	portrait08: {
		url: 'https://images.pexels.com/photos/7984904/pexels-photo-7984904.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	portrait09: {
		url: 'https://images.pexels.com/photos/6954012/pexels-photo-6954012.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	portrait10: {
		url: 'https://images.pexels.com/photos/16030380/pexels-photo-16030380.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	portrait11: {
		url: 'https://images.pexels.com/photos/10469312/pexels-photo-10469312.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service01: {
		url: 'https://images.pexels.com/photos/7195800/pexels-photo-7195800.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service02: {
		url: 'https://images.pexels.com/photos/7984966/pexels-photo-7984966.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service03: {
		url: 'https://images.pexels.com/photos/35341765/pexels-photo-35341765.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service04: {
		url: 'https://images.pexels.com/photos/20092123/pexels-photo-20092123.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service05: {
		url: 'https://images.pexels.com/photos/8834040/pexels-photo-8834040.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service06: {
		url: 'https://images.pexels.com/photos/19239100/pexels-photo-19239100.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service07: {
		url: 'https://images.pexels.com/photos/3094211/pexels-photo-3094211.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service08: {
		url: 'https://images.pexels.com/photos/8834060/pexels-photo-8834060.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service09: {
		url: 'https://images.pexels.com/photos/7755176/pexels-photo-7755176.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service10: {
		url: 'https://images.pexels.com/photos/36876030/pexels-photo-36876030.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service11: {
		url: 'https://images.pexels.com/photos/20092123/pexels-photo-20092123.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service12: {
		url: 'https://images.pexels.com/photos/7755663/pexels-photo-7755663.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service13: {
		url: 'https://images.pexels.com/photos/7819723/pexels-photo-7819723.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service14: {
		url: 'https://images.pexels.com/photos/6599037/pexels-photo-6599037.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service15: {
		url: 'https://images.pexels.com/photos/34132695/pexels-photo-34132695.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service16: {
		url: 'https://images.pexels.com/photos/8834048/pexels-photo-8834048.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service17: {
		url: 'https://images.pexels.com/photos/30660990/pexels-photo-30660990.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
	service18: {
		url: 'https://images.pexels.com/photos/8834048/pexels-photo-8834048.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
	},
};

const profileAssignments = [
	{ userId: 2, sourceKey: 'portrait01' },
	{ userId: 3, sourceKey: 'portrait02' },
	{ userId: 4, sourceKey: 'portrait03' },
	{ userId: 5, sourceKey: 'portrait04' },
	{ userId: 6, sourceKey: 'portrait05' },
	{ userId: 7, sourceKey: 'portrait06' },
	{ userId: 8, sourceKey: 'portrait07' },
	{ userId: 9, sourceKey: 'portrait08' },
	{ userId: 10, sourceKey: 'portrait09' },
	{ userId: 11, sourceKey: 'portrait10' },
	{ userId: 12, sourceKey: 'portrait11' },
];

const serviceSourceById = {
	1: 'service01',
	2: 'service02',
	3: 'service03',
	4: 'service04',
	5: 'service09',
	6: 'service05',
	7: 'service14',
	8: 'service10',
	9: 'service07',
	10: 'service15',
	11: 'service11',
	12: 'service16',
	13: 'service17',
	14: 'service12',
	15: 'service18',
	16: 'service13',
	17: 'service07',
	18: 'service06',
	19: 'service05',
	20: 'service09',
	21: 'service02',
	22: 'service03',
	23: 'service05',
	24: 'service11',
	25: 'service06',
	26: 'service12',
	27: 'service13',
	28: 'service14',
	29: 'service03',
	30: 'service15',
	31: 'service16',
	32: 'service04',
	33: 'service17',
	34: 'service18',
};

function getExtensionFromSource(source) {
	if (source.localPath) {
		return path.extname(source.localPath) || '.jpg';
	}

	const pathname = new URL(source.url).pathname;
	return path.extname(pathname) || '.jpg';
}

async function ensureCleanDirectory(directoryPath) {
	await fs.rm(directoryPath, { recursive: true, force: true });
	await fs.mkdir(directoryPath, { recursive: true });
}

async function downloadSourceFile(sourceKey) {
	const source = sources[sourceKey];

	if (!source) {
		throw new Error(`Source inconnue: ${sourceKey}`);
	}

	await fs.mkdir(sourceCacheDir, { recursive: true });

	const extension = getExtensionFromSource(source);
	const cachedPath = path.join(sourceCacheDir, `${sourceKey}${extension}`);

	try {
		await fs.access(cachedPath);
		return cachedPath;
	} catch {
		// Rien à faire ici, on fabrique le cache juste en dessous.
	}

	if (source.localPath) {
		await fs.copyFile(source.localPath, cachedPath);
		return cachedPath;
	}

	const response = await fetch(source.url);
	if (!response.ok) {
		throw new Error(`Téléchargement impossible pour ${sourceKey}`);
	}

	const buffer = Buffer.from(await response.arrayBuffer());
	await fs.writeFile(cachedPath, buffer);

	return cachedPath;
}

async function copySourceToTarget(sourceKey, targetPath) {
	const cachedPath = await downloadSourceFile(sourceKey);
	await fs.copyFile(cachedPath, targetPath);
}

async function applyServiceVariant(targetPath, variantIndex) {
	if (variantIndex <= 0) {
		return;
	}

	// Quand une même photo sert à plusieurs services, je lui fais une petite variante
	// pour casser l'effet "copier/coller" dans la démo sans changer l'ambiance globale.
	const pythonScript = `
from PIL import Image, ImageEnhance
import sys

target_path = sys.argv[1]
variant_index = int(sys.argv[2])

image = Image.open(target_path).convert("RGB")
width, height = image.size

if variant_index % 5 == 1:
    image = image.transpose(Image.FLIP_LEFT_RIGHT)
elif variant_index % 5 == 2:
    crop_x = max(0, int(width * 0.08))
    image = image.crop((crop_x, 0, width, height)).resize((width, height))
elif variant_index % 5 == 3:
    crop_y = max(0, int(height * 0.08))
    image = image.crop((0, crop_y, width, height)).resize((width, height))
elif variant_index % 5 == 4:
    image = ImageEnhance.Color(image).enhance(0.92)
    image = ImageEnhance.Contrast(image).enhance(1.05)
else:
    image = ImageEnhance.Brightness(image).enhance(1.06)

image.save(target_path, quality=92)
`;

	await execFileAsync('python3', ['-c', pythonScript, targetPath, String(variantIndex)]);
}

async function main() {
	const client = new Client(dbConfig);

	try {
		await ensureCleanDirectory(profileDir);
		await ensureCleanDirectory(serviceDir);
		await client.connect();

		// Je remets les images de démo à plat à chaque run pour éviter les vieux doublons.
		const serviceIds = Object.keys(serviceSourceById).map(Number);
		await client.query('DELETE FROM images_services_professionals WHERE service_id = ANY($1::int[])', [serviceIds]);

		for (const assignment of profileAssignments) {
			const extension = getExtensionFromSource(sources[assignment.sourceKey]);
			const fileName = `pro-${assignment.userId}${extension}`;
			const absolutePath = path.join(profileDir, fileName);
			const publicUrl = `/uploads/profile-picture/demo/${fileName}`;

			await copySourceToTarget(assignment.sourceKey, absolutePath);
			await client.query(
				`UPDATE users
				 SET profile_picture = $1,
				     profile_picture_path = $2
				 WHERE users_id = $3`,
				[publicUrl, absolutePath, assignment.userId]
			);
		}

		const servicesResult = await client.query(
			`SELECT service_id, professional_id
			 FROM services
			 WHERE service_id = ANY($1::int[])
			 ORDER BY service_id ASC`,
			[serviceIds]
		);

		const serviceSourceUsage = new Map();

		for (const service of servicesResult.rows) {
			const sourceKey = serviceSourceById[service.service_id];
			const extension = getExtensionFromSource(sources[sourceKey]);
			const fileName = `service-${service.service_id}${extension}`;
			const absolutePath = path.join(serviceDir, fileName);
			const publicUrl = `/uploads/service-images/demo/${fileName}`;
			const usageCount = serviceSourceUsage.get(sourceKey) || 0;

			await copySourceToTarget(sourceKey, absolutePath);
			await applyServiceVariant(absolutePath, usageCount);
			serviceSourceUsage.set(sourceKey, usageCount + 1);
			await client.query(
				`INSERT INTO images_services_professionals (pro_id, service_id, image_url, picture_path)
				 VALUES ($1, $2, $3, $4)`,
				[service.professional_id, service.service_id, publicUrl, absolutePath]
			);
		}

		console.log('Media de démo générés avec succès.');
	} finally {
		await client.end().catch(() => {});
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
