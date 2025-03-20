from rest_framework import serializers
from .models import MyUser
from shop.models import Shop,ProductOrService


class MyUserSerializer(serializers.ModelSerializer):
    followed_shops = serializers.PrimaryKeyRelatedField(queryset=Shop.objects.all(), many=True, required=False)
    saved_products_or_services = serializers.PrimaryKeyRelatedField(queryset=ProductOrService.objects.all(), many=True, required=False)

    class Meta:
        model = MyUser
        fields = ['id','username', 'email', 'password', 'bio', 'profile_image', 'followed_shops', 'saved_products_or_services']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Extract fields that are not password-related
        password = validated_data.pop('password')
        followed_shops = validated_data.pop('followed_shops', [])
        saved_products_or_services = validated_data.pop('saved_products_or_services', [])

        # Create the user instance
        user = MyUser.objects.create(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()

        # Assign ManyToMany relationships
        if followed_shops:
            user.followed_shops.set(followed_shops)  # Use .set() to assign ManyToMany
        if saved_products_or_services:
            user.saved_products_or_services.set(saved_products_or_services)  # Use .set() for ManyToMany

        return user
