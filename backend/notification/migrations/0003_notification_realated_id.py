# Generated by Django 5.1.6 on 2025-03-24 09:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notification', '0002_rename_seen_notification_read_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='realated_id',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
