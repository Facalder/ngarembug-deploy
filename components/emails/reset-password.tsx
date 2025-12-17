import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

type ResetPasswordEmailProps = {
    username: string;
    resetUrl: string;
    userEmail: string;
};

const ResetPasswordEmail = (props: ResetPasswordEmailProps) => {
    const { username, resetUrl, userEmail } = props;

    return (
        <Html dir="ltr" lang="id">
            <Tailwind>
                <Head />
                <Preview>Reset password Anda</Preview>
                <Body className="bg-gray-50 py-8 font-sans">
                    <Container className="mx-auto max-w-[500px] bg-white p-8 rounded-lg">

                        {/* Header */}
                        <Heading className="text-2xl font-bold text-gray-800 mb-4">
                            Reset Password
                        </Heading>

                        {/* Content */}
                        <Text className="text-gray-700 mb-4">
                            Halo <strong>{username}</strong>,
                        </Text>

                        <Text className="text-gray-700 mb-6">
                            Anda menerima email ini karena ada permintaan untuk mereset password akun <strong>{userEmail}</strong>.
                        </Text>

                        {/* Button */}
                        <Section className="text-center mb-6">
                            <Button
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                                href={resetUrl}
                            >
                                Reset Password Sekarang
                            </Button>
                        </Section>

                        {/* Alternative Link */}
                        <Text className="text-sm text-gray-600 mb-6">
                            Atau copy link berikut ke browser Anda:
                            <br />
                            <Link className="text-blue-600 break-all" href={resetUrl}>
                                {resetUrl}
                            </Link>
                        </Text>

                        {/* Security Notice */}
                        <Text className="text-sm text-gray-600 mb-4">
                            ⚠️ Link ini akan kadaluarsa dalam 24 jam.
                        </Text>

                        <Text className="text-sm text-gray-600 mb-6">
                            Jika Anda tidak meminta reset password, abaikan email ini.
                        </Text>

                        {/* Footer */}
                        <Text className="text-xs text-gray-500 border-t border-gray-200 pt-4">
                            Email ini dikirim ke {userEmail}
                            <br />
                            © 2025 Company Name. All rights reserved.
                        </Text>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ResetPasswordEmail;