import graphene
import graphql_jwt

from users.schema import Query as UsersQuery

from users.schema import Mutation as UsersMutation


class Query(UsersQuery, graphene.ObjectType):
    pass


class Mutation(UsersMutation, graphene.ObjectType):
    token_auth = graphql_jwt.relay.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.relay.Verify.Field()
    refresh_token = graphql_jwt.relay.Refresh.Field()

    revoke_token = graphql_jwt.relay.Revoke.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
