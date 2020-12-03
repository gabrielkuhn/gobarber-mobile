import React, { useCallback, useRef } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import Input from '../../components/Input'
import Button from '../../components/Button'
import logoImg from '../../assets/logo.png'
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText
} from './styles'
import { ScrollView } from 'react-native-gesture-handler'

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const navigation = useNavigation()

  const handleSignIn = useCallback((data: object) => {
    console.log(data)
  }, [])

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Faça seu logon</Title>
            </View>
            <Form onSubmit={handleSignIn} ref={formRef}>
              <Input
                name="email"
                icon="mail"
                placeholder="E-mail"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />
              <Input
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                returnKeyType="send"
                ref={passwordInputRef}
                onSubmitEditing={() => {
                  formRef.current?.submitForm()
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm()
                }}
              >
                Entrar
              </Button>
            </Form>
            <ForgotPassword
              onPress={() => {
                console.log('a')
              }}
            >
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  )
}

export default SignIn
