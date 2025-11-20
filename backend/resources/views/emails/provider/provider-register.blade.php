<!DOCTYPE html>
<html>

<head>
    <title>New Provider Registration</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* INLINE CSS from the provided template for email client compatibility */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #ECF0F1;
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #FFFFFF;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            /* Changed color for an Admin notification (Action/Alert) */
            background: linear-gradient(135deg, #F39C12 0%, #E67E22 100%);
            padding: 40px 30px;
            text-align: center;
            color: #FFFFFF;
        }

        .logo {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 10px;
        }

        .header-icon {
            font-size: 60px;
            margin-bottom: 20px;
        }

        .header-title {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
        }

        .email-body {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 20px;
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 20px;
        }

        .message {
            font-size: 16px;
            color: #2C3E50;
            margin-bottom: 15px;
        }

        .highlight {
            /* Adjusted highlight color to match new header color */
            color: #E67E22;
            font-weight: 700;
        }

        /* New styles for provider details table */
        .provider-details {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            background-color: #F9F9F9;
            border-radius: 8px;
            overflow: hidden;
        }

        .provider-details th,
        .provider-details td {
            padding: 14px 20px;
            text-align: left;
            border-bottom: 1px solid #ECF0F1;
        }

        .provider-details th {
            background-color: #ECF0F1;
            color: #2C3E50;
            width: 30%;
            font-weight: 600;
        }

        .provider-details td {
            color: #34495E;
        }

        .cta-container {
            text-align: center;
            margin: 35px 0;
        }

        .cta-button {
            display: inline-block;
            /* Adjusted button color to match new header color */
            background: linear-gradient(135deg, #F39C12 0%, #E67E22 100%);
            color: #FFFFFF !important;
            /* Added !important for link styles */
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 8px 20px rgba(230, 126, 34, 0.3);
            transition: transform 0.3s;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(230, 126, 34, 0.4);
        }

        .email-footer {
            background-color: #2C3E50;
            padding: 30px;
            text-align: center;
            color: #FFFFFF;
        }

        .footer-text {
            margin: 5px 0;
            font-size: 14px;
            opacity: 0.9;
        }

        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ECF0F1;
        }

        .signature-name {
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 5px;
        }

        .signature-team {
            color: #7F8C8D;
            font-size: 14px;
        }

        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }

            .email-header {
                padding: 30px 20px;
            }

            .email-body {
                padding: 30px 20px;
            }

            .header-title {
                font-size: 24px;
            }

            .cta-button {
                padding: 14px 30px;
                font-size: 15px;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <div class="header-icon">🔔</div>
            <h1 class="header-title">New Provider Registration!</h1>
        </div>

        <div class="email-body">
            <div class="greeting">Hello Admin,</div>

            <p class="message">
                A new provider has successfully registered an account and is awaiting <span class="highlight">Provider
                    approval</span>.
                Please review their details.
            </p>

            <h3>Provider Account Details:</h3>

            <table class="provider-details">
                <tr>
                    <th>Name:</th>
                    <td>{{ $provider->name }}</td>
                </tr>
                <tr>
                    <th>Email:</th>
                    <td><a href="mailto:{{ $provider->email }}">{{ $provider->email }}</a></td>
                </tr>
                <tr>
                    <th>Phone:</th>
                    <td>{{ $provider->phone }}</td>
                </tr>
                <tr>
                    <th>Address:</th>
                    <td>{{ $provider->address }}</td>
                </tr>
                <tr>
                    <th>Registered On:</th>
                    <td>{{ $provider->created_at->format('M d, Y H:i A') }}</td>
                </tr>
                {{-- Add more fields here if available, e.g., phone, company --}}
            </table>

            <div class="cta-container">
                {{-- Replace with your actual admin route to view the provider's profile/approval page --}}
                <a href="{{ config('app.url') }}/admin/providers" class="cta-button">
                    Review and Approve Provider
                </a>
            </div>

            <p class="message">
                **Action Required:** Log in to your admin panel to verify the provider's information and complete the
                approval process.
            </p>

            <div class="signature">
                <div class="signature-name">Automated Notification</div>
                <div class="signature-team">The {{ config('app.name') }} System</div>
            </div>
        </div>

        <div class="email-footer">
            <div class="footer-text">{{ config('app.name') }} Admin Portal</div>
            <div class="footer-text" style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </div>
        </div>
    </div>
</body>

</html>