from .models import Shop,ProductOrService,ProductImage
from rest_framework.response import Response
from .serializers import ShopSerializer,ProductOrServiceSerializer
from rest_framework import generics,permissions,status
from django.db.models import Q
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from notification.models import Notification

# Custom pagination class
class ProductPagination(PageNumberPagination):
    page_size = 10  # Number of items per page
    page_size_query_param = 'page_size'
    max_page_size = 100




from django.core.exceptions import ObjectDoesNotExist

class ProductOrServiceListCreateAPIView(generics.ListCreateAPIView):
    queryset = ProductOrService.objects.all()
    serializer_class = ProductOrServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = ProductPagination

    def create(self, request, *args, **kwargs):
        # Get the shop instance using the ID
        shop_id = request.data.get('shop')
        try:
            shop_instance = Shop.objects.get(id=shop_id)  # Get the Shop instance
        except Shop.DoesNotExist:
            return Response({'detail': 'Shop not found.'}, status=status.HTTP_400_BAD_REQUEST)

        # Handle file uploads
        files = request.FILES.getlist('images')  # Get the list of files

        # Remove images from the data to prevent passing them directly to the model
        data = {
            key: value for key, value in request.data.items() if key != 'images'
        }

        # Use serializer to create the product and attach the shop
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            # Save the product or service instance without the images
            product_or_service_instance = serializer.save(shop=shop_instance)

            # Associate the images with the product (since image is a ManyToManyField)
            for file in files:
                product_image = ProductImage.objects.create(image=file)
                product_or_service_instance.image.add(product_image)

            # Notify the followers of the shop
            followers = shop_instance.followers.all()  # Get all the followers of the shop
            for follower in followers:
                Notification.objects.create(
                    user=follower,
                    message=f'{shop_instance.name} added a new product! Check it out.',
                    notification_type='product',
                    related_id=product_or_service_instance.id
                )


            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

pos_create_view = ProductOrServiceListCreateAPIView.as_view()





class ShopsListCreateAPIView(generics.ListCreateAPIView):
    queryset=Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes=[permissions.IsAuthenticatedOrReadOnly]

shop_create_view = ShopsListCreateAPIView.as_view()


class ProductOrServiceDetailAPIView(generics.RetrieveAPIView):
    queryset = ProductOrService.objects.all()
    serializer_class = ProductOrServiceSerializer
    permission_classes=[permissions.AllowAny]

pos_detail_view = ProductOrServiceDetailAPIView.as_view()

class ShopDetailAPIView(generics.RetrieveAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes=[permissions.IsAuthenticatedOrReadOnly]

shop_view = ShopDetailAPIView.as_view()


class ProductOrServiceUpdateAPIView(generics.UpdateAPIView):
    queryset = ProductOrService.objects.all()
    serializer_class = ProductOrServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def update(self, request, *args, **kwargs):
        # Get the product instance to update
        product_or_service_instance = self.get_object()

        # Handle file uploads (new images)
        files = request.FILES.getlist('images')  # Get the list of files

        # Make a copy of the request data and remove images to prevent passing them to the model
        data = request.data.copy()  # Make a copy of the data
        data.pop('images', None)  # Remove the images key

        # Use the serializer to update the product data
        serializer = self.get_serializer(product_or_service_instance, data=data, partial=True)
        if serializer.is_valid():
            # Save the updated product or service
            product_or_service_instance = serializer.save()

            # If new images were uploaded, delete existing ones and associate the new ones
            if files:
                # Remove the old images
                product_or_service_instance.image.clear()

                # Add new images
                for file in files:
                    product_image = ProductImage.objects.create(image=file)
                    product_or_service_instance.image.add(product_image)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
           
pos_update_view = ProductOrServiceUpdateAPIView.as_view()


class ProductOrServiceDeleteAPIView(generics.DestroyAPIView):
    queryset = ProductOrService.objects.all()
    serializer_class = ProductOrServiceSerializer
    permission_classes=[permissions.IsAuthenticatedOrReadOnly]

pos_delete_view = ProductOrServiceDeleteAPIView.as_view()



def filter_products(request):
    category = request.GET.get('category', 'All')
    
    # Fetch products based on category
    if category == 'All':
        products = ProductOrService.objects.all()
    else:
        products = ProductOrService.objects.filter(category=category)
    
    baseurl = "https://younest.onrender.com"
    
    # Prepare response data
    data = [
        {
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'category': p.category,
            'created_at': p.created_at,
            'product_type': p.product_type,
            'image': [
                {'id': idx + 1, 'image': baseurl + img.image.url}  # Access the image field within ProductImage
                for idx, img in enumerate(p.image.all())  # p.image.all() returns related ProductImage objects
            ] if p.image.exists() else [],
            'shop': {
                'id': p.shop.id,
                'name': p.shop.name,
                'location': p.shop.location,
                'contact': p.shop.contact,
                'logo': p.shop.logo.url if p.shop.logo else None,
                'created_at': p.shop.created_at,
                'followers': [follower.id for follower in p.shop.followers.all()],
                'owner': p.shop.owner.id,
            }
        }
        for p in products
    ]
    
    return JsonResponse({'products': data}, safe=False)


def search(request):
    query = request.GET.get('query', '')
    if not query:
        return JsonResponse({'error': 'No search query provided'}, status=400)

    # Search in ProductOrService model
    product_or_service_results = ProductOrService.objects.filter(
        Q(name__icontains=query) | 
        Q(description__icontains=query) | 
        Q(category__icontains=query)
    ).order_by("-created_at")
    
    baseurl = "https://younest.onrender.com"
    # Prepare response data
    data = {
        'results': [
            {
                'id': result.id,
                'name': result.name,
                'description': result.description,
                'price': result.price,
                'category': result.category,
                'created_at': result.created_at,
                'product_type': result.product_type,
                'image': [
                    {'id': img.id, 'image': baseurl + img.image.url} 
                    for img in result.image.all()  # Assuming result.image is related (e.g. ManyToManyField)
                ] if result.image.exists() else [],
                'shop': {
                    'id': result.shop.id,
                    'name': result.shop.name,
                    'location': result.shop.location,
                    'contact': result.shop.contact,
                    'logo': result.shop.logo.url if result.shop.logo else None,
                    'created_at': result.shop.created_at,
                    'followers': [follower.id for follower in result.shop.followers.all()],
                    'owner': result.shop.owner.id,
                }
            }
            for result in product_or_service_results
        ]
    }

    return JsonResponse(data, safe=False)




class ShopProductsAPIView(APIView):
    """
    This view will return the products associated with a specific shop, including images as objects with id and image fields.
    """

    def get(self, request, pk, *args, **kwargs):
        try:
            # Get the shop by ID
            shop = Shop.objects.get(id=pk)
        except Shop.DoesNotExist:
            return Response({"error": "Shop not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get the products associated with this shop
        products = ProductOrService.objects.filter(shop=shop)
        
        # Serialize the products
        serializer = ProductOrServiceSerializer(products, many=True)
        
        # Process images for each product to ensure they are in the correct format
        base_url = 'https://younest.onrender.com'
        for product in serializer.data:
            if product.get('image'):
                # Assuming 'image' is a list of dictionaries containing 'image' URLs
                product['image'] = [
                    {'id': idx + 1, 'image': base_url + img['image']} if isinstance(img, dict) else {'id': idx + 1, 'image': base_url + img}
                    for idx, img in enumerate(product['image'])
                ]

        # Return the serialized data
        return Response(serializer.data)
shop_products = ShopProductsAPIView.as_view()


class UserShopsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get shops for the logged-in user
        user = request.user
        shops = Shop.objects.filter(owner=user)  # Assuming 'owner' is a ForeignKey to the User model
        serializer = ShopSerializer(shops,context={'request': request}, many=True)
        return Response(serializer.data)

user_shops_view = UserShopsAPIView.as_view()


def fetch_all_pos(request):
    products = ProductOrService.objects.all().order_by("-created_at")
   
    baseurl = "https://younest.onrender.com"
    
    # Prepare response data
    data = [
        {
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'category': p.category,
            'created_at': p.created_at,
            'product_type': p.product_type,
            'image': [
                {'id': idx + 1, 'image': baseurl + img.image.url}  # Access the image field within ProductImage
                for idx, img in enumerate(p.image.all())  # p.image.all() returns related ProductImage objects
            ] if p.image.exists() else [],
            'shop': {
                'id': p.shop.id,
                'name': p.shop.name,
                'location': p.shop.location,
                'contact': p.shop.contact,
                'logo': p.shop.logo.url if p.shop.logo else None,
                'created_at': p.shop.created_at,
                'followers': [follower.id for follower in p.shop.followers.all()],
                'owner': p.shop.owner.id,
            }
        }
        for p in products
    ]
    
    return JsonResponse({'products': data}, safe=False)



class FollowUnfollowShopAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        try:
            shop = Shop.objects.get(pk=pk)
        except Shop.DoesNotExist:
            return Response({"detail": "Shop not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if shop.followers.filter(id=user.id).exists():
            shop.followers.remove(user)  # Unfollow
            Notification.objects.create( 
                user=shop.owner, 
                message=f'{user.username} unfollowed your shop!', 
                notification_type='follow' ,
                related_id=shop.id,
                )
        else:
            shop.followers.add(user)  # Follow
            Notification.objects.create( 
                user=shop.owner, 
                message=f'{user.username} followed your shop!', 
                notification_type='follow',
                related_id=shop.id, 
                )

        # Serialize and return updated shop data
        serializer = ShopSerializer(shop, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

follow_unfollow_shop = FollowUnfollowShopAPIView.as_view()
