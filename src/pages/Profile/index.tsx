import React, { useCallback, useRef } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
  Alert
} from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import api from '../../services/api'
import Icon from 'react-native-vector-icons/Feather'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { ScrollView } from 'react-native-gesture-handler'
import getValidationErrors from '../../utils/getValidationErrors'
import {
  BackButton,
  Container,
  Title,
  UserAvatarButton,
  UserAvatar
} from './styles'
import { useAuth } from '../../hooks/auth'

interface ProfileFormData {
  name: string
  email: string
  password: string
  // eslint-disable-next-line camelcase
  old_password: string
  // eslint-disable-next-line camelcase
  password_confirmation: string
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()

  const formRef = useRef<FormHandles>(null)
  const emailInputRef = useRef<TextInput>(null)
  const oldPasswordInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const confirmPasswordInputRef = useRef<TextInput>(null)

  const navigation = useNavigation()

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          name: Yup.string().required('O nome é obrigatório'),
          email: Yup.string()
            .required('O e-mail é obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string()
              .required('Campo obrigatório')
              .min(6, 'A senha deve conter no mínimo 6 dígitos'),
            otherwise: Yup.string()
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string()
                .required('Campo obrigatório')
                .min(6, 'A senha deve conter no mínimo 6 dígitos'),
              otherwise: Yup.string()
            })
            .oneOf([Yup.ref('password')], 'Confirmação incorreta')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        const {
          name,
          email,
          // eslint-disable-next-line camelcase
          old_password,
          password,
          // eslint-disable-next-line camelcase
          password_confirmation
        } = data

        const formData = Object.assign(
          {
            name,
            email
          },
          data.old_password
            ? {
                old_password,
                password,
                password_confirmation
              }
            : {}
        )

        const response = await api.put('/profile', formData)

        updateUser(response.data)

        Alert.alert(
          'Perfil atualizado com sucesso!',
          'Seus dados foram atualizados.'
        )

        navigation.goBack()
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)

          return
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar o perfil, tente novamente.'
        )
      }
    },
    [navigation]
  )

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form
              initialData={{
                user
              }}
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus()
                }}
              />
              <Input
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                ref={emailInputRef}
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus()
                }}
              />
              <Input
                secureTextEntry
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                textContentType="password"
                returnKeyType="next"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
                ref={oldPasswordInputRef}
              />
              <Input
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova senha"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus()
                }}
                ref={passwordInputRef}
              />
              <Input
                secureTextEntry
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm()
                }}
                ref={confirmPasswordInputRef}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm()
                }}
              >
                Confirmar alterações
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default Profile
