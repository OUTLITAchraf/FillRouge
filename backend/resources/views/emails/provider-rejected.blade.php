<!DOCTYPE html>
<html>
<head>
    <title>Provider Application Update</title>
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
            background: linear-gradient(135deg, #E67E22 0%, #D35400 100%);
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
            color: #E67E22;
            font-weight: 700;
        }
        
        .info-box {
            background: rgba(230, 126, 34, 0.05);
            border-left: 4px solid #E67E22;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .info-title {
            font-size: 18px;
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 15px;
        }
        
        .reasons-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .reasons-list li {
            padding: 8px 0;
            color: #2C3E50;
            font-size: 15px;
        }
        
        .reasons-list li:before {
            content: "• ";
            color: #E67E22;
            font-weight: 700;
            margin-right: 8px;
        }
        
        .next-steps-box {
            background: rgba(46, 204, 113, 0.05);
            border-left: 4px solid #2ECC71;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .next-steps-title {
            font-size: 18px;
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 15px;
        }
        
        .steps-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .steps-list li {
            padding: 8px 0;
            color: #2C3E50;
            font-size: 15px;
        }
        
        .steps-list li:before {
            content: "→ ";
            color: #2ECC71;
            font-weight: 700;
            margin-right: 8px;
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
        
        .footer-links {
            margin-top: 20px;
        }
        
        .footer-links a {
            color: #2ECC71;
            text-decoration: none;
            margin: 0 10px;
            font-size: 14px;
            font-weight: 600;
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
        
        .note {
            background: #FFF3E0;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 15px;
            color: #2C3E50;
        }
        
        .note strong {
            color: #E67E22;
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
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <div class="header-icon">📋</div>
            <h1 class="header-title">Application Status Update</h1>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            <div class="greeting">Hello {{ $user->name }},</div>
            
            <p class="message">
                Thank you for your interest in becoming a service provider on {{ config('app.name') }}. After careful review of your application, we regret to inform you that we are <span class="highlight">unable to approve</span> your provider account at this time.
            </p>
            
            <p class="message">
                We understand this may be disappointing, and we want to be transparent about the decision.
            </p>
            
            <!-- Reasons Box -->
            <div class="info-box">
                <div class="info-title">Common reasons for rejection include:</div>
                <ul class="reasons-list">
                    <li>Incomplete profile information</li>
                    <li>Missing required documentation or certifications</li>
                    <li>Service area not currently covered</li>
                    <li>Insufficient professional experience verification</li>
                    <li>Application does not meet our quality standards</li>
                </ul>
            </div>
            
            <!-- Note -->
            <div class="note">
                <strong>Good News:</strong> This decision is not permanent. You're welcome to reapply once you've addressed the concerns or gained additional qualifications.
            </div>
            
            <!-- Next Steps Box -->
            <div class="next-steps-box">
                <div class="next-steps-title">What You Can Do Next:</div>
                <ul class="steps-list">
                    <li>Review and update your profile with complete information</li>
                    <li>Gather any missing certifications or documentation</li>
                    <li>Gain more experience in your service area</li>
                    <li>Contact our support team for specific feedback</li>
                    <li>Reapply after 30 days</li>
                </ul>
            </div>
            
            <p class="message">
                Thank you for your understanding, and we hope to see you reapply in the future!
            </p>
            
            <!-- Signature -->
            <div class="signature">
                <div class="signature-name">Best regards,</div>
                <div class="signature-team">The {{ config('app.name') }} Team</div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <div class="footer-text">{{ config('app.name') }} - Morocco's Leading Service Platform</div>
            <div class="footer-links">
                <a href="{{ config('app.url') }}">Website</a> |
                <a href="{{ config('app.url') }}/help">Help Center</a> |
                <a href="{{ config('app.url') }}/contact">Contact Us</a>
            </div>
            <div class="footer-text" style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>