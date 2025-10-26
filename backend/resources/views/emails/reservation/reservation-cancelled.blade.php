<!DOCTYPE html>
<html>
<head>
    <title>Reservation Cancelled</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
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
            /* Red gradient for cancellation/alert */
            background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
            padding: 40px 30px;
            text-align: center;
            color: #FFFFFF;
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
            /* Red highlight color */
            color: #E74C3C;
            font-weight: 700;
        }

        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            background-color: #F8F9F9;
            border-radius: 8px;
            overflow: hidden;
        }

        .details-table th, .details-table td {
            padding: 15px;
            text-align: left;
            font-size: 15px;
            border-bottom: 1px solid #ECF0F1;
        }

        .details-table th {
            background-color: #ECF0F1;
            color: #34495E;
            font-weight: 600;
            width: 35%;
        }

        .details-table td {
            color: #2C3E50;
            font-weight: 500;
        }

        .cta-container {
            text-align: center;
            margin: 35px 0;
        }

        .cta-button {
            display: inline-block;
            /* Red button color */
            background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
            color: #FFFFFF !important;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 8px 20px rgba(231, 76, 60, 0.3);
            transition: transform 0.3s;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(231, 76, 60, 0.4);
        }

        .info-box {
            background: rgba(231, 76, 60, 0.05); /* Red-tinted background */
            border-left: 4px solid #E74C3C; /* Red border */
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }

        .info-box h3 {
            font-size: 18px;
            font-weight: 700;
            color: #2C3E50;
            margin-top: 0;
            margin-bottom: 15px;
        }

        .info-box p {
            margin: 5px 0;
            color: #2C3E50;
            font-size: 15px;
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
        <!-- Header -->
        <div class="email-header">
            <div class="header-icon">⚠️</div>
            <h1 class="header-title">Reservation Cancelled</h1>
        </div>

        <!-- Body -->
        <div class="email-body">
            {{-- Use the $client variable for the greeting --}}
            <div class="greeting">Hello {{ $client->name }},</div>

            <p class="message">
                This is a notification that your reservation for the service: 
                **{{ $reservation->service->title }}** has been officially **cancelled**.
            </p>

            <table class="details-table">
                <thead>
                    <tr>
                        <th colspan="2" style="background-color: #ECF0F1; text-align: center; font-size: 16px;">
                            Cancelled Booking Summary
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Provider</th>
                        <td>{{ $reservation->service->provider->name}}</td>
                    </tr>
                    <tr>
                        <th>Original Date & Time</th>
                        {{-- Assuming 'date' is a field on the reservation model --}}
                        <td>{{ \Carbon\Carbon::parse($reservation->date)->format('F d, Y \a\t h:i A') ?? 'N/A' }}</td>
                    </tr>
                    <tr>
                        <th>Price</th>
                        <td>{{ $reservation->service->price }} DH</td>
                    </tr>
                </tbody>
            </table>

            <!-- Next Steps Box -->
            <div class="info-box">
                <h3>Next Steps</h3>
                <p><strong>Rebooking:</strong> You may book a new time slot with the provider or explore similar services on our platform.</p>
            </div>

            <!-- CTA Button -->
            <div class="cta-container">
                {{-- Assuming a route to the client's reservations dashboard --}}
                <a href="{{ config('app.url') }}/client/dashboard/reservations" class="cta-button">View My Reservations</a>
            </div>

            <p class="message" style="margin-top: 25px;">
                We apologize for any inconvenience this may cause and thank you for your understanding.
            </p>

            <!-- Signature -->
            <div class="signature">
                <div class="signature-name">Sincerely,</div>
                <div class="signature-team">The {{ config('app.name') }} Team</div>
            </div>
        </div>

        <!-- Footer (No links, maintaining consistency) -->
        <div class="email-footer">
            <div class="footer-text">{{ config('app.name') }} - Your Platform Name</div>

            <div class="footer-text" style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
