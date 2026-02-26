const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { leads, email, name, context, persona, source } = body;

    // Handle batch leads or single lead
    const leadsToProcess = leads || [{
      email,
      name,
      context,
      persona,
      source,
      timestamp: new Date().toISOString()
    }];

    // Validate leads
    const validLeads = leadsToProcess.filter(lead => {
      return lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email);
    });

    if (validLeads.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'No valid leads provided' })
      };
    }

    // Store leads (you can integrate with your database/CRM here)
    // For now, we'll send a notification email and store in a simple format
    
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@ermits.com';
    const adminEmail = process.env.ADMIN_EMAIL || fromEmail;

    // If SendGrid is configured, send notification email
    if (apiKey) {
      sgMail.setApiKey(apiKey);

      // Send notification to admin
      const leadSummary = validLeads.map(lead => 
        `- ${lead.email}${lead.name ? ` (${lead.name})` : ''} - ${lead.context || 'general'}${lead.persona ? ` - Persona: ${lead.persona}` : ''}`
      ).join('\n');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .lead-item { background: white; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #667eea; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ New Lead(s) Captured</h1>
              <p>${new Date().toLocaleString()}</p>
            </div>
            <div class="content">
              <h2>${validLeads.length} New Lead(s):</h2>
              ${validLeads.map(lead => `
                <div class="lead-item">
                  <strong>Email:</strong> ${lead.email}<br>
                  ${lead.name ? `<strong>Name:</strong> ${lead.name}<br>` : ''}
                  <strong>Context:</strong> ${lead.context || 'general'}<br>
                  ${lead.persona ? `<strong>Persona:</strong> ${lead.persona}<br>` : ''}
                  <strong>Source:</strong> ${lead.source || 'simple_version'}<br>
                  <strong>Time:</strong> ${new Date(lead.timestamp).toLocaleString()}
                </div>
              `).join('')}
            </div>
            <div class="footer">
              <p>This is an automated notification from SocialCaution Lead Capture System</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const textContent = `
NEW LEAD(S) CAPTURED
${new Date().toLocaleString()}

${validLeads.length} New Lead(s):

${validLeads.map(lead => `
Email: ${lead.email}
${lead.name ? `Name: ${lead.name}\n` : ''}Context: ${lead.context || 'general'}
${lead.persona ? `Persona: ${lead.persona}\n` : ''}Source: ${lead.source || 'simple_version'}
Time: ${new Date(lead.timestamp).toLocaleString()}
---`).join('\n')}

This is an automated notification from SocialCaution Lead Capture System
      `;

      try {
        await sgMail.send({
          to: adminEmail,
          from: fromEmail,
          subject: `New Lead(s) Captured - ${validLeads.length} lead(s)`,
          text: textContent,
          html: htmlContent
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the request if email fails - lead is still captured
      }
    }

    // TODO: Store leads in your database/CRM
    // Example integrations:
    // - Google Sheets API
    // - Airtable API
    // - HubSpot API
    // - Mailchimp API
    // - Your own database

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: `${validLeads.length} lead(s) captured successfully`,
        count: validLeads.length
      })
    };

  } catch (error) {
    console.error('Error capturing lead:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to capture lead', 
        details: error.message 
      })
    };
  }
};

