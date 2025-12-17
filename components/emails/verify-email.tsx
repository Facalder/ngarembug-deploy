import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Link,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

type VerifyEmailProps = {
    username: string;
    verifyUrl: string;
};

const VerifyEmail = (props: VerifyEmailProps) => {
    const { username, verifyUrl } = props;

    return (
        <Html dir="ltr" lang="id">
            <Tailwind>
                <Head />
                <Body className="bg-gray-50 py-8 font-sans">
                    <Container className="mx-auto max-w-[500px] bg-white p-8 rounded-lg">

                        {/* Header */}
                        <Text className="text-2xl font-bold text-gray-800 mb-4">
                            Verifikasi Email Anda
                        </Text>

                        {/* Content */}
                        <Text className="text-gray-700 mb-4">
                            Halo <strong>{username}</strong>,
                        </Text>

                        <Text className="text-gray-700 mb-6">
                            Terima kasih telah mendaftar! Silakan verifikasi email Anda dengan klik tombol di bawah ini untuk mengaktifkan akun Anda.
                        </Text>

                        {/* Button */}
                        <Section className="text-center mb-6">
                            <Button
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                                href={verifyUrl}
                            >
                                Verifikasi Email
                            </Button>
                        </Section>

                        {/* Alternative Link */}
                        <Text className="text-sm text-gray-600 mb-6">
                            Atau copy link berikut ke browser Anda:
                            <br />
                            <Link className="text-blue-600 break-all" href={verifyUrl}>
                                {verifyUrl}
                            </Link>
                        </Text>

                        {/* Notice */}
                        <Text className="text-sm text-gray-600 mb-4">
                            ⚠️ Link verifikasi ini akan kadaluarsa dalam 24 jam.
                        </Text>

                        <Text className="text-sm text-gray-600 mb-6">
                            Jika Anda tidak mendaftar, abaikan email ini.
                        </Text>

                        {/* Footer */}
                        <Text className="text-xs text-gray-500 border-t border-gray-200 pt-4 text-center">
                            © 2025 Company Name. All rights reserved.
                        </Text>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default VerifyEmail;