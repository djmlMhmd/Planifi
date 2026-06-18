import { useEffect, useState } from 'react';
import { readJsonSafely } from './profileNetwork';
import { UserAvatar } from './profileIcons';

function SectionCard({ children }) {
	return (
		<section className="rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,248,244,0.96)_100%)] p-7 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
			{children}
		</section>
	);
}

function SectionHeading({ children, className = '' }) {
	return <h2 className={`text-[1.35rem] font-semibold text-[#151515] ${className}`}>{children}</h2>;
}

function TextField({ label, className = '', inputClassName = '', ...inputProps }) {
	return (
		<label className={`flex flex-col gap-2 ${className}`}>
			<span className="text-[0.95rem] font-medium text-[#151515]">{label}</span>
			<input
				{...inputProps}
				className={`h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 text-[#151515] outline-none transition focus:border-black/18 focus:bg-white ${inputClassName}`}
			/>
		</label>
	);
}

function SaveButton({ children = 'Enregistrer', className = '', ...props }) {
	return (
		<button
			type="button"
			{...props}
			className={`rounded-[14px] bg-[#101010] px-5 py-3 text-[0.96rem] font-semibold text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)] ${className}`}
		>
			{children}
		</button>
	);
}

function PreferenceToggle({ checked, onClick, label }) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={label}
			onClick={onClick}
			className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition ${checked ? 'bg-[#101010]' : 'bg-black/12'}`}
		>
			<span
				className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] transition ${
					checked ? 'left-6' : 'left-1'
				}`}
			/>
		</button>
	);
}

function PreferenceBlock({ title, items }) {
	return (
		<div className="rounded-[20px] bg-[#f2f1ed] p-5">
			<h3 className="text-[1.1rem] font-semibold text-[#151515]">{title}</h3>
			<div className="mt-5 space-y-4">
				{items.map((item) => (
					<div key={item.label} className="flex items-center justify-between gap-6">
						<p className="text-[0.98rem] text-[#242424]">{item.label}</p>
						<PreferenceToggle checked={item.checked} onClick={item.onClick} label={item.label} />
					</div>
				))}
			</div>
		</div>
	);
}

function usePasswordState(userId) {
	const [passwordState, setPasswordState] = useState({
		previousPassword: '',
		newPassword: '',
		confirmPassword: '',
		loading: false,
		message: '',
		error: '',
	});

	function handlePasswordFieldChange(field, value) {
		setPasswordState((current) => ({
			...current,
			[field]: value,
			message: '',
			error: '',
		}));
	}

	async function handlePasswordSubmit(event) {
		event.preventDefault();

		if (!passwordState.previousPassword || !passwordState.newPassword || !passwordState.confirmPassword) {
			setPasswordState((current) => ({
				...current,
				error: 'Renseigne tous les champs du mot de passe.',
				message: '',
			}));
			return;
		}

		if (passwordState.newPassword !== passwordState.confirmPassword) {
			setPasswordState((current) => ({
				...current,
				error: 'Le nouveau mot de passe et sa confirmation ne correspondent pas.',
				message: '',
			}));
			return;
		}

		setPasswordState((current) => ({ ...current, loading: true, message: '', error: '' }));

		try {
			const response = await fetch(`/profil/${userId}/change-password`, {
				method: 'PUT',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					previousPassword: passwordState.previousPassword,
					newPassword: passwordState.newPassword,
				}),
			});
			const payload = await readJsonSafely(response);

			if (!response.ok) {
				setPasswordState((current) => ({
					...current,
					loading: false,
					message: '',
					error: payload?.message || 'Impossible de modifier le mot de passe.',
				}));
				return;
			}

			setPasswordState({
				previousPassword: '',
				newPassword: '',
				confirmPassword: '',
				loading: false,
				message: 'Mot de passe mis à jour.',
				error: '',
			});
		} catch {
			setPasswordState((current) => ({
				...current,
				loading: false,
				message: '',
				error: 'Erreur réseau lors de la mise à jour du mot de passe.',
			}));
		}
	}

	return {
		passwordState,
		handlePasswordFieldChange,
		handlePasswordSubmit,
	};
}

function PasswordSection({ userId, inputClassName = 'h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 outline-none', wrapperClassName = '' }) {
	const { passwordState, handlePasswordFieldChange, handlePasswordSubmit } = usePasswordState(userId);

	return (
		<section className={wrapperClassName}>
			<SectionHeading>Sécurité</SectionHeading>
			<form className="mt-8 grid max-w-[720px] gap-5" onSubmit={handlePasswordSubmit}>
				<TextField
					label="Mot de passe actuel"
					type="password"
					value={passwordState.previousPassword}
					onChange={(event) => handlePasswordFieldChange('previousPassword', event.target.value)}
					inputClassName={inputClassName}
				/>
				<TextField
					label="Nouveau mot de passe"
					type="password"
					value={passwordState.newPassword}
					onChange={(event) => handlePasswordFieldChange('newPassword', event.target.value)}
					inputClassName={inputClassName}
				/>
				<TextField
					label="Confirmer le nouveau mot de passe"
					type="password"
					value={passwordState.confirmPassword}
					onChange={(event) => handlePasswordFieldChange('confirmPassword', event.target.value)}
					inputClassName={inputClassName}
				/>

				<button
					type="submit"
					disabled={passwordState.loading}
					className={`mt-2 self-start rounded-[14px] px-5 py-3 text-[0.96rem] font-semibold text-white shadow-[0_12px_28px_rgba(10,10,10,0.18)] ${
						passwordState.loading ? 'cursor-not-allowed bg-black/30' : 'bg-[#101010]'
					}`}
				>
					{passwordState.loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
				</button>
			</form>

			{passwordState.message ? <p className="mt-5 text-[0.94rem] font-medium text-[#1f6b3b]">{passwordState.message}</p> : null}
			{passwordState.error ? <p className="mt-5 text-[0.94rem] font-medium text-[#c35555]">{passwordState.error}</p> : null}
		</section>
	);
}

export function SettingsPanel({ profile, onProfileUpdated }) {
	const [uploadState, setUploadState] = useState({ loading: false, message: '', error: '' });

	async function handlePictureUpload(event) {
		const file = event.target.files?.[0];
		event.target.value = '';

		if (!file) {
			return;
		}

		const localPreviewUrl = URL.createObjectURL(file);
		onProfileUpdated({
			...profile,
			profile_picture_preview: localPreviewUrl,
			profile_picture: localPreviewUrl,
		});

		const formData = new FormData();
		formData.append('image', file);
		setUploadState({ loading: true, message: '', error: '' });

		try {
			const response = await fetch('/profil/update-profil-picture', {
				method: 'PUT',
				credentials: 'same-origin',
				body: formData,
			});
			const payload = await readJsonSafely(response);

			if (!response.ok) {
				setUploadState({
					loading: false,
					message: '',
					error: payload?.message || "Impossible de mettre à jour la photo de profil.",
				});
				return;
			}

			if (payload?.message) {
				const nextProfile = { ...payload.message };
				nextProfile.profile_picture_preview = localPreviewUrl;
				onProfileUpdated(nextProfile);
			}

			setUploadState({
				loading: false,
				message: 'Photo de profil mise à jour.',
				error: '',
			});
		} catch {
			setUploadState({
				loading: false,
				message: '',
				error: 'Erreur réseau lors de l’envoi de la photo.',
			});
		}
	}

	return (
		<div className="space-y-8">
			<SectionCard>
				<div className="flex items-start justify-between gap-8">
					<div className="min-w-0 flex-1">
						<SectionHeading>Informations du compte</SectionHeading>
						<div className="mt-8 flex flex-wrap gap-8 text-[0.98rem] text-[#1a1a1a]">
							<label className="flex items-center gap-3">
								<input type="radio" name="title" defaultChecked className="accent-[#101010]" />
								<span>Madame</span>
							</label>
							<label className="flex items-center gap-3">
								<input type="radio" name="title" className="accent-[#101010]" />
								<span>Monsieur</span>
							</label>
							<label className="flex items-center gap-3">
								<input type="radio" name="title" className="accent-[#101010]" />
								<span>Non spécifiée</span>
							</label>
						</div>
					</div>

					<div className="relative shrink-0">
						<UserAvatar profile={profile} size="h-28 w-28" textSize="text-4xl" />
						<label
							htmlFor="profile-picture-input"
							className="absolute bottom-1 left-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#101010] text-xl font-semibold text-white shadow-[0_10px_24px_rgba(10,10,10,0.22)]"
						>
							+
						</label>
						<input id="profile-picture-input" type="file" accept="image/png,image/jpeg,image/jpg,image/gif" className="hidden" onChange={handlePictureUpload} />
					</div>
				</div>

				<div className="mt-10 grid gap-6 md:grid-cols-2">
					<TextField label="Nom *" type="text" defaultValue={profile.lastName || ''} />
					<TextField label="Prénom *" type="text" defaultValue={profile.firstName || ''} />
					<TextField label="Date de naissance *" type="text" placeholder="JJ/MM/AAAA" className="md:max-w-[340px]" />
				</div>

				<SaveButton className="mt-7">Enregistrer</SaveButton>
				{uploadState.message ? <p className="mt-5 text-[0.94rem] font-medium text-[#1f6b3b]">{uploadState.message}</p> : null}
				{uploadState.error ? <p className="mt-5 text-[0.94rem] font-medium text-[#c35555]">{uploadState.error}</p> : null}
				{uploadState.loading ? <p className="mt-5 text-[0.94rem] text-black/52">Mise à jour de la photo…</p> : null}
			</SectionCard>

			<SectionCard>
				<SectionHeading>Adresse</SectionHeading>
				<div className="mt-6 grid max-w-[760px] gap-5 md:grid-cols-2">
					<TextField label="Adresse *" type="text" defaultValue={profile.address || ''} placeholder="Nom de la rue et ville/code postal" className="md:col-span-2" />
					<TextField label="Ville *" type="text" defaultValue={profile.city || ''} placeholder="Ville" />
					<TextField label="Pays *" type="text" defaultValue={profile.country || ''} placeholder="Pays" />
				</div>
				<SaveButton className="mt-7">Enregistrer</SaveButton>
			</SectionCard>

			<SectionCard>
				<SectionHeading>E-mail</SectionHeading>
				<div className="mt-6 flex max-w-[720px] items-center gap-3 rounded-[16px] border border-black/6 bg-[#f2f1ed] p-3">
					<div className="min-w-0 flex-1 px-2 text-[1rem] text-[#151515]">{profile.email}</div>
					<SaveButton>Modifier</SaveButton>
				</div>
			</SectionCard>

			<SectionCard>
				<SectionHeading>Préférences</SectionHeading>
				<div className="mt-6 space-y-5">
					<PreferenceBlock
						title="Informations"
						items={[
							{ label: 'Afficher mon adresse sur mon profil', checked: false, onClick: () => {} },
							{ label: 'Afficher mon numéro de téléphone sur mon profil', checked: true, onClick: () => {} },
						]}
					/>
				</div>
				<SaveButton className="mt-6">Enregistrer les modifications</SaveButton>
			</SectionCard>

			<SectionCard>
				<PasswordSection userId={profile.users_id} />
			</SectionCard>
		</div>
	);
}

export function ProfessionalSettingsPanel({ profile, onProfileUpdated }) {
	const [accountForm, setAccountForm] = useState({
		title: 'madame',
		firstName: profile.firstName || '',
		lastName: profile.lastName || '',
		birthDate: '',
	});
	const [companyForm, setCompanyForm] = useState({
		email: profile.email || '',
		companyName: profile.company_name || '',
		siret: profile.siret || '',
		companyAddress: profile.company_address || '',
		phone: profile.phone || '',
	});
	const [emailEditable, setEmailEditable] = useState(false);
	const [accountMessage, setAccountMessage] = useState('');
	const [companyMessage, setCompanyMessage] = useState('');
	const [preferenceToggles, setPreferenceToggles] = useState({
		showAddress: false,
		showPhone: true,
	});

	useEffect(() => {
		setAccountForm((current) => ({
			...current,
			firstName: profile.firstName || '',
			lastName: profile.lastName || '',
		}));
		setCompanyForm({
			email: profile.email || '',
			companyName: profile.company_name || '',
			siret: profile.siret || '',
			companyAddress: profile.company_address || '',
			phone: profile.phone || '',
		});
	}, [profile]);

	function saveAccountSection() {
		onProfileUpdated({
			...profile,
			firstName: accountForm.firstName,
			lastName: accountForm.lastName,
		});
		setAccountMessage('Informations du compte mises à jour.');
	}

	function saveCompanySection() {
		onProfileUpdated({
			...profile,
			email: companyForm.email,
			company_name: companyForm.companyName,
			company_address: companyForm.companyAddress,
			phone: companyForm.phone,
			siret: companyForm.siret,
		});
		setCompanyMessage('Informations professionnelles mises à jour.');
		setEmailEditable(false);
	}

	function togglePreference(key) {
		setPreferenceToggles((current) => ({
			...current,
			[key]: !current[key],
		}));
	}

	const sectionClass = 'border-t border-black/8 pt-7';
	const inputClass = 'h-12 rounded-[14px] border border-black/6 bg-[#f2f1ed] px-4 text-[#151515] outline-none transition focus:border-black/18 focus:bg-white';

	return (
		<div className="space-y-8 rounded-[24px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(249,248,244,0.96)_100%)] p-7 shadow-[0_16px_38px_rgba(17,19,30,0.05)]">
			<section>
				<h2 className="text-[2rem] font-semibold tracking-[-0.04em] text-[#151515]">Paramètres</h2>

				<div className="mt-8">
					<SectionHeading>Information du compte</SectionHeading>
					<div className="mt-8 flex flex-wrap gap-8 text-[0.98rem] text-[#1a1a1a]">
						{[
							{ value: 'madame', label: 'Madame' },
							{ value: 'monsieur', label: 'Monsieur' },
							{ value: 'non-specifiee', label: 'Non spécifiée' },
						].map((option) => (
							<label key={option.value} className="flex items-center gap-3">
								<input
									type="radio"
									name="pro-title"
									checked={accountForm.title === option.value}
									onChange={() => {
										setAccountForm((current) => ({ ...current, title: option.value }));
										setAccountMessage('');
									}}
									className="accent-[#101010]"
								/>
								<span>{option.label}</span>
							</label>
						))}
					</div>

					<div className="mt-10 grid gap-6 md:grid-cols-2">
						<TextField
							label="Nom *"
							type="text"
							value={accountForm.lastName}
							onChange={(event) => {
								setAccountForm((current) => ({ ...current, lastName: event.target.value }));
								setAccountMessage('');
							}}
							inputClassName={inputClass}
						/>
						<TextField
							label="Prénom *"
							type="text"
							value={accountForm.firstName}
							onChange={(event) => {
								setAccountForm((current) => ({ ...current, firstName: event.target.value }));
								setAccountMessage('');
							}}
							inputClassName={inputClass}
						/>
						<TextField
							label="Date de naissance *"
							type="text"
							placeholder="JJ/MM/AAAA"
							value={accountForm.birthDate}
							onChange={(event) => {
								setAccountForm((current) => ({ ...current, birthDate: event.target.value }));
								setAccountMessage('');
							}}
							className="md:max-w-[340px]"
							inputClassName={inputClass}
						/>
					</div>

					<SaveButton className="mt-7 transition hover:-translate-y-px" onClick={saveAccountSection}>
						Enregistrer
					</SaveButton>
					{accountMessage ? <p className="mt-4 text-[0.94rem] font-medium text-[#1f6b3b]">{accountMessage}</p> : null}
				</div>
			</section>

			<section className={sectionClass}>
				<SectionHeading>Adresse</SectionHeading>
				<div className="mt-6 grid max-w-[760px] gap-5 md:grid-cols-2">
					<TextField label="Adresse *" type="text" defaultValue={profile.address || ''} placeholder="Nom de la rue et ville/code postal" className="md:col-span-2" inputClassName={inputClass} />
					<TextField label="Ville *" type="text" defaultValue={profile.city || ''} placeholder="Ville" inputClassName={inputClass} />
					<TextField label="Pays *" type="text" defaultValue={profile.country || ''} placeholder="Pays" inputClassName={inputClass} />
				</div>
				<SaveButton className="mt-7 transition hover:-translate-y-px">Enregistrer</SaveButton>
			</section>

			<section className={sectionClass}>
				<SectionHeading>E-mail</SectionHeading>
				<div className="mt-6 flex max-w-[720px] items-center gap-3 rounded-[16px] border border-black/6 bg-[#f2f1ed] p-3">
					<input
						type="email"
						value={companyForm.email}
						onChange={(event) => {
							setCompanyForm((current) => ({ ...current, email: event.target.value }));
							setCompanyMessage('');
						}}
						disabled={!emailEditable}
						className="min-w-0 flex-1 bg-transparent px-2 text-[1rem] text-[#151515] outline-none disabled:text-[#151515]"
					/>
					<SaveButton onClick={() => setEmailEditable((value) => !value)}>
						{emailEditable ? 'Valider' : 'Modifier'}
					</SaveButton>
				</div>
			</section>

			<section className={sectionClass}>
				<SectionHeading>Détails de l'entreprise</SectionHeading>
				<div className="mt-8 grid gap-6 md:grid-cols-2">
					<TextField
						label="Nom de l’entreprise"
						type="text"
						value={companyForm.companyName}
						onChange={(event) => {
							setCompanyForm((current) => ({ ...current, companyName: event.target.value }));
							setCompanyMessage('');
						}}
						inputClassName={`${inputClass} text-black/68`}
					/>
					<TextField
						label="Numéro SIRET"
						type="text"
						value={companyForm.siret}
						onChange={(event) => {
							setCompanyForm((current) => ({ ...current, siret: event.target.value }));
							setCompanyMessage('');
						}}
						placeholder="123 456 789 XXXXX"
						inputClassName={inputClass}
					/>
					<TextField
						label="Adresse de l’entreprise *"
						type="text"
						value={companyForm.companyAddress}
						onChange={(event) => {
							setCompanyForm((current) => ({ ...current, companyAddress: event.target.value }));
							setCompanyMessage('');
						}}
						inputClassName={inputClass}
					/>
					<TextField
						label="Numéro de téléphone *"
						type="text"
						value={companyForm.phone}
						onChange={(event) => {
							setCompanyForm((current) => ({ ...current, phone: event.target.value }));
							setCompanyMessage('');
						}}
						inputClassName={inputClass}
					/>
				</div>

				<SaveButton className="mt-7 transition hover:-translate-y-px" onClick={saveCompanySection}>
					Enregistrer
				</SaveButton>
				{companyMessage ? <p className="mt-4 text-[0.94rem] font-medium text-[#1f6b3b]">{companyMessage}</p> : null}
			</section>

			<section className={sectionClass}>
				<SectionHeading>Préférences</SectionHeading>
				<div className="mt-6 space-y-5">
					<PreferenceBlock
						title="Informations"
						items={[
							{
								label: 'Afficher mon adresse sur mon profil',
								checked: preferenceToggles.showAddress,
								onClick: () => togglePreference('showAddress'),
							},
							{
								label: 'Afficher mon numéro de téléphone sur mon profil',
								checked: preferenceToggles.showPhone,
								onClick: () => togglePreference('showPhone'),
							},
						]}
					/>
				</div>
			</section>

			<PasswordSection userId={profile.users_id} inputClassName={inputClass} wrapperClassName={sectionClass} />
		</div>
	);
}
